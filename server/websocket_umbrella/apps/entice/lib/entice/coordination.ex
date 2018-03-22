defmodule Entice.Entity.Coordination do
  @moduledoc """
  Observes entities and propagates their state changes to different channels

  Your entity will always receive 3 different kinds of messages:

      {:entity_join, %{entity_id: id, attributes: %{} = inital_attributes}}
      {:entity_change, %{entity_id: id, added: %{} = added_attributes, changed: %{} = changed_attributes, removed: %{} = removed_attributes}}
      {:entity_leave, %{entity_id: id, attributes: %{} = last_attributes}}

  You can also passively observe from a standard process and receive those messages.
  """
  require Logger
  alias Entice.Entity.Coordination
  alias Entice.Entity

  defstruct channel: nil

  def start(), do: :pg2.start()

  def register(entity, channel) when is_atom(channel) do
    # does nothing if exists
    :pg2.create(channel)
    :pg2.join(channel, entity)
    Entity.put_behaviour(entity, Coordination.Behaviour, {channel})
  end

  def register_observer(pid, channel) when is_pid(pid) do
    # does nothing if exists
    :pg2.create(channel)
    :pg2.join(channel, pid)
    notify_observe(channel, pid)
  end

  def stop_channel(channel) do
    case :pg2.get_members(channel) do
      {:error, {:no_such_group, ^channel}} ->
        :ok

      [] ->
        :pg2.delete(channel)

      [_ | _] = members ->
        members |> Enum.map(fn pid -> send(pid, {:coordination_stop_channel, channel}) end)
        :pg2.delete(channel)
    end
  end

  @doc "This might fail silently. This is because entities might have died by the time we message them"
  def notify(entity, message) when is_pid(entity) do
    send(entity, message)
    :ok
  end

  def notify(nil, _message), do: {:error, :entity_nil}
  def notify(entity_id, message), do: notify(Entity.get(entity_id), message)

  def notify_locally(entity, message), do: notify(entity, {:coordination_notify_locally, message})

  def notify_all(channel, message) do
    case :pg2.get_members(channel) do
      {:error, {:no_such_group, ^channel}} ->
        :error

      [] ->
        :ok

      [_ | _] = members ->
        members |> Enum.map(fn pid -> send(pid, message) end)
    end
  end

  def get_all(channel), do: :pg2.get_members(channel)

  # Internal API

  def notify_join(channel, pid, %{} = attributes),
    do: notify_all(channel, {:entity_join, %{pid: pid, attributes: attributes}})

  def notify_change(channel, pid, {%{} = added, %{} = changed, %{} = removed}),
    do:
      notify_all(
        channel,
        {:entity_change, %{pid: pid, added: added, changed: changed, removed: removed}}
      )

  def notify_leave(channel, pid, %{} = attributes),
    do: notify_all(channel, {:entity_leave, %{pid: pid, attributes: attributes}})

  def notify_observe(channel, pid) when is_pid(pid),
    do: notify_all(channel, {:observer_join, %{observer: pid}})

  # This should be replaced by another process that does the monitoring from the outside,
  # since we're cluttering the entity with behaviours and it gets increasingly complex
  defmodule Behaviour do
    use Entice.Entity.Behaviour
    alias Entice.Entity.Coordination
    alias Entice.Entity

    def init(%Entity{attributes: attribs} = entity, {channel}) do
      Coordination.notify_join(channel, entity.id, attribs)
      {:ok, entity |> put_attribute(%Coordination{channel: channel})}
    end

    def handle_event(
          {:coordination_stop_channel, channel},
          %Entity{attributes: %{Coordination => %Coordination{channel: channel}}} = entity
        ),
        do: {:stop, :stop_channel, entity}

    def handle_event(
          {:coordination_notify_locally, message},
          %Entity{attributes: %{Coordination => %Coordination{channel: channel}}} = entity
        ) do
      Coordination.notify_all(channel, message)
      {:ok, entity}
    end

    def handle_event(
          {:entity_join, %{entity_id: sender_entity, attributes: _attrs}},
          %Entity{attributes: attribs} = entity
        ) do
      # announce ourselfes to the new entity
      Coordination.notify(
        sender_entity,
        {:entity_join, %{entity_id: entity.id, attributes: attribs}}
      )

      {:ok, entity}
    end

    def handle_event(
          {:observer_join, %{observer: sender_pid}},
          %Entity{attributes: attribs} = entity
        ) do
      # announce ourselfes to the new observer
      send(sender_pid, {:entity_join, %{entity_id: entity.id, attributes: attribs}})
      {:ok, entity}
    end

    def handle_change(
          %Entity{attributes: old_attributes},
          %Entity{attributes: %{Coordination => %Coordination{channel: channel}} = new_attributes} =
            entity
        ) do
      change_set = diff(old_attributes, new_attributes)
      if not_empty?(change_set), do: Coordination.notify_change(channel, entity.id, change_set)
      :ok
    end

    def terminate(:stop_channel, entity), do: {:ok, entity}

    def terminate(
          _reason,
          %Entity{attributes: %{Coordination => %Coordination{channel: channel}} = attribs} =
            entity
        ) do
      Coordination.notify_leave(channel, entity.id, attribs)
      {:ok, entity}
    end

    # internal

    defp diff(old_attrs, new_attrs) do
      missing = old_attrs |> Map.take(Map.keys(old_attrs) -- Map.keys(new_attrs))
      {both, added} = Map.split(new_attrs, Map.keys(old_attrs))

      changed =
        both
        |> Map.keys()
        |> Enum.filter_map(fn key -> old_attrs[key] != new_attrs[key] end, fn key ->
             {key, new_attrs[key]}
           end)
        |> Enum.into(%{})

      {added, changed, missing}
    end

    defp not_empty?({added, changed, removed}),
      do: [added, changed, removed] |> Enum.any?(&(not Enum.empty?(&1)))
  end
end
