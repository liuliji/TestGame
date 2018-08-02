defmodule Websocket.ServerRoom.PlayingBehaviour do
    alias Websocket.ServerRoom, as: ServerRoom
    alias Websocket.ServerRoom.Room
    require Logger

    use Entice.Entity.Behaviour
    alias Entice.Entity

    @action_kanpai 1
    @action_yazhu 2
    @action_qipai 3
    @action_kaipai 4

    def init(entity, :ok) do
        send(self(), :next_talk)
        {:ok, entity}
    end

    def handle_event(:next_talk,
    %Entity{attributes: %{Room => room}} = entity) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        receive next_talk"
        currIndex = next_index(room.currIndex, length(room.playingIndexList))

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

    defp handle_actions_(%{"aId" => @action_kanpai}, user_pid, pos, room) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        aId: #{@action_kanpai}."
        send(self(), {:notify_all, {:kanpai, pos}})
        room
    end

    defp handle_actions_(%{"aId" => @action_yazhu, "count" => count}, user_pid, pos, room) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        aId：#{@action_yazhu}."
        send(self(), {:notify_all, {:yazhu, pos, count}})
        room
    end

    defp handle_actions_(%{"aId" => @action_qipai}, user_pid, pos, room) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        aId：#{@action_qipai}."
        playingIndexList = room.playingIndexList |> List.delete(pos)
        currIndex = last_index(room.currIndex, length(playingIndexList))
        send(self(), {:notify_all, {:qipai, pos}})
        %{room |
            currIndex: currIndex,
            playingIndexList: playingIndexList
        }
    end

    defp handle_actions_(%{"aId" => @action_kaipai}, user_pid, pos, room) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        aId：#{@action_kaipai}."
        send(self(), {:notify_all, {:kaipai, pos}})
        room
    end

    # def handle_event(msg,
    # %Entity{attributes: %{Room => room}} = entity) do
    #     {:become, Websocket.ServerRoom.EndingBehaviour, :ok, entity}
    # end

    defp next_index(-1, list_size) do
        :random.uniform(list_size) - 1
    end
    
    defp next_index(curIndex, list_size) do
        rem(curIndex+1, list_size)
    end


    # 注意这是删除当前发言用户之后的 找到上一个用户 作为这轮的发言用户
    defp last_index(0, list_size) do
        list_size - 1
    end

    defp last_index(curIndex, list_size) do
        curIndex - 1
    end
end