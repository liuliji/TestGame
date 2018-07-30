defmodule Websocket.ServerRoom.MainBehaviour do
    alias Websocket.ServerRoom2, as: ServerRoom
    alias Websocket.ServerRoom2.Room
    require Logger

    use Entice.Entity.Behaviour
    alias Entice.Entity
    alias Websocket.ServerRoom.UnreadyedBehaviour

    def init(entity, %Room{} = args) do
        Logger.info "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
        init room #{inspect args}"
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

    def terminate(reason,
    %Entity{attributes: %{Room => room}} = entity) do
        Logger.warn "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
        room #{inspect room.roomId} terminate .
        reason: #{inspect reason}
        roomInfo: #{inspect room}"
        {:ok, entity}
    end

    # ----------------- some method start---------------
    def get_seat(pid, uid) do
        case Entity.call_behaviour(pid, UnreadyedBehaviour, {:takeSeat, uid}) do
            {:error, :not_found} ->
                -1
            ret ->
                ret
        end
    end

    def remove_seat(pid, uid) when is_bitstring(uid) do
        Entity.call_behaviour(pid, DefaultBehaviour, {:removeSeat, uid})
    end

    def remove_seat(pid, pos) when is_integer(pos) do
        Entity.call_behaviour(pid, DefaultBehaviour, {:removeSeat, pos})
    end
    # ----------------- some method end---------------
end