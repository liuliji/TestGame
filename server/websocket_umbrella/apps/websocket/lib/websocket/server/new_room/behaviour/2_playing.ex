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

    def handle_event({:action, %{"aId" => aId, "uid" => uid} = msg},
    %Entity{attributes: %{Room => room}} = entity) do
        
        pos = room.playingIndexList
        |> Enum.at(room.currIndex)
        
        user_info_in_room = room.users |> Map.get(pos)

        ret = 
        if (uid == user_info_in_room.uid) do
            room = handle_actions_(msg, user_info_in_room.pid, pos, room)
            # if (aId == 4) do
                # {:become, Websocket.ServerRoom.EndingBehaviour, :ok, entity}
            # else
                {:ok, entity |> put_attribute(room)}
            # end
        else
            Logger.info "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            not current active player. client uid:#{inspect uid}, cur uid:#{inspect user_info_in_room.uid}"
            {:ok, entity}
        end
    end

    defp handle_actions_(%{"aId" => 1}, user_pid, pos, room) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        aId: 1."
        send(self(), {:notify_all, {:kanpai, pos}})
        room
    end

    defp handle_actions_(%{"aId" => 2, "count" => count}, user_pid, pos, room) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        aId：2."
        send(self(), {:notify_all, {:yazhu, pos, count}})
        room
    end

    defp handle_actions_(%{"aId" => 3}, user_pid, pos, room) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        aId：3."
        send(self(), {:notify_all, {:qipai, pos}})
        room
    end

    defp handle_actions_(%{"aId" => 4}, user_pid, pos, room) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        aId：4."
        send(self(), {:notify_all, {:kaipai, pos}})
        room
    end

    # def handle_event(msg,
    # %Entity{attributes: %{Room => room}} = entity) do
    #     {:become, Websocket.ServerRoom.EndingBehaviour, :ok, entity}
    # end
end