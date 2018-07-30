defmodule Entice.Entity do
  @moduledoc """
  Thin convenience wrapper around a `Entice.Utils.SyncEvent` manager.
  """
  alias Entice.Entity.{Attribute, Suicide}
  alias Entice.Entity
  alias Entice.Utils.SyncEvent
  require Logger

  defstruct id: "", attributes: %{}

  # Entity lifecycle & retrieval API

  def start, do: start(UUID.uuid4())
  def start(entity_id), do: start(entity_id, %{})

  def start(opts) when is_list(opts), do: start(UUID.uuid4(), %{}, opts)

  def start(entity_id, attributes) when is_list(attributes) do
    start(entity_id, attributes |> Enum.into(%{}, fn x -> {x.__struct__, x} end))
  end

  @doc "Starts a new entity with attached attribute management behaviour"
  def start(entity_id, attributes, opts \\ []) when is_map(attributes) do
    {:ok, pid} = start_plain(entity_id, attributes, opts)
    pid |> Attribute.register()
    # if anyone asks, it was Et's idea
    pid |> Suicide.register()
    {:ok, pid}
  end

  @doc "Starts an empty entity (just the ID and process, no attributes, no behaviours, no coordination). Mainly for testing"
  def start_plain(entity_id \\ UUID.uuid4(), attributes \\ %{}, opts \\ []) do
    {:ok, pid} = SyncEvent.start_link(%Entity{id: entity_id, attributes: attributes}, opts)
  end

  def stop(entity_id), do: Process.exit(entity_id, :kill)

  def exists?(entity_id) when is_pid(entity_id) do
    Process.alive?(entity_id)
  end

  def exists?(entity_id) do
    false
  end

  def get(entity_id) do
    entity_id
  end

  # Attribute API (delegates to attribute-management behaviour)

  def has_attribute?(entity, attribute_type), do: Attribute.has?(entity, attribute_type)

  def fetch_attribute(entity, attribute_type), do: Attribute.fetch(entity, attribute_type)

  def fetch_attribute!(entity, attribute_type), do: Attribute.fetch!(entity, attribute_type)

  def get_attribute(entity, attribute_type), do: Attribute.get(entity, attribute_type)

  def get_and_update_attribute(entity, attribute_type, modifier),
    do: Attribute.get_and_update(entity, attribute_type, modifier)

  def take_attributes(entity, attribute_types), do: Attribute.take(entity, attribute_types)

  def put_attribute(entity, attribute), do: Attribute.put(entity, attribute)

  def update_attribute(entity, attribute_type, modifier),
    do: Attribute.update(entity, attribute_type, modifier)

  def remove_attribute(entity, attribute_type), do: Attribute.remove(entity, attribute_type)

  @doc """
  Takes a function that takes the entities current attributes and returns new attributes,
  replaces the entities attributes with these new ones and replies with the new ones.
  """
  def attribute_transaction(entity, modifier), do: Attribute.transaction(entity, modifier)

  # Behaviour API

  def call_behaviour(entity, behaviour, message) when is_pid(entity) and is_atom(behaviour),
    do: SyncEvent.call(entity, behaviour, message)

  def call_behaviour(entity_id, behaviour, message),
    do: entity_id |> lookup_and_do(&call_behaviour(&1, behaviour, message))

  def has_behaviour?(entity, behaviour) when is_pid(entity) and is_atom(behaviour),
    do: SyncEvent.has_handler?(entity, behaviour)

  def has_behaviour?(entity_id, behaviour),
    do: entity_id |> lookup_and_do(&has_behaviour?(&1, behaviour))

  def put_behaviour(entity, behaviour, args) when is_pid(entity) and is_atom(behaviour),
    do: SyncEvent.put_handler(entity, behaviour, args)

  def put_behaviour(entity_id, behaviour, args) do
    entity_id |> lookup_and_do(&put_behaviour(&1, behaviour, args))
  end

  def remove_behaviour(entity, behaviour) when is_pid(entity) and is_atom(behaviour),
    do: SyncEvent.remove_handler(entity, behaviour)

  def remove_behaviour(entity_id, behaviour),
    do: entity_id |> lookup_and_do(&remove_behaviour(&1, behaviour))

  # Internal

  defp lookup_and_do(entity_id, fun) do
    if exists?(entity_id) do
      fun.(entity_id)
    else
      :error
    end
  end
end
