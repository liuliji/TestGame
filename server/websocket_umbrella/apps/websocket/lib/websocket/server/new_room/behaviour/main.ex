defmodule Websocket.ServerRoom.MainBehaviour do
    alias Websocket.ServerRoom, as: ServerRoom
    alias Websocket.ServerRoom.Room
    require Logger

    use Entice.Entity.Behaviour
    alias Entice.Entity
    alias Websocket.ServerRoom.UnreadyedBehaviour

    def init(entity, %Room{} = args) do
        Logger.info "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
        init room #{inspect args}"
        Entity.put_behaviour(self(), UnreadyedBehaviour, :ok)
        entity = put_attribute(entity, args)
        {:ok, entity}
    end

    def handle_event({:notify_all, msg},
    %Entity{attributes: %{Room => room}} = entity) do
        room.users |> Enum.each(fn
            {pos, %{pid: pid}} -> send(pid, msg)
            {pos, nil} -> nil
        end)
        {:ok, entity}
    end

    def terminate({:shutdown, :dissolveRoom},
    %Entity{attributes: %{Room => room}} = entity) do
        Logger.info "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
        room #{inspect room.roomId} terminate .
        reason: dissolveRoom
        roomInfo: #{inspect room}"
        room.users |> Enum.each(fn
            {pos, %{pid: pid}} -> send(pid, :leavedRoom)
            {pos, nil} -> nil
        end)
        {:ok, entity}
    end

    def terminate(reason,
    %Entity{attributes: %{Room => room}} = entity) do
        Logger.warn "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
        room #{inspect room.roomId} terminate .
        reason: #{inspect reason}
        roomInfo: #{inspect room}"
        {:ok, entity}
    end

    
end