defmodule Websocket.ServerRoom.PlayingBehaviour do
    alias Websocket.ServerRoom, as: ServerRoom
    alias Websocket.ServerRoom.Room
    require Logger

    use Entice.Entity.Behaviour
    alias Entice.Entity

    def init(entity, :ok) do
        send(self(), :next_talk)
        {:ok, entity}
    end

    def handle_event(:next_talk,
    %Entity{attributes: %{Room => room}} = entity) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        receive next_talk"
        currIndex = if (room.currIndex == -1) do   
            Enum.random(room.playingIndexList)
        else
            rem(room.currIndex+1, length(room.playingIndexList))
        end

        room = %{room | currIndex: currIndex}
        pos =  Enum.at(room.playingIndexList, currIndex)
        user = Map.get(room.users, pos)
        send(self(), {:notify_all, {:next_talk, pos}})
        # send(user.pid, :next_talk)
        {:ok, entity |> put_attribute(room)}
    end

    def handle_event(msg,
    %Entity{attributes: %{Room => room}} = entity) do
        {:become, Websocket.ServerRoom.EndingBehaviour, :ok, entity}
    end
end