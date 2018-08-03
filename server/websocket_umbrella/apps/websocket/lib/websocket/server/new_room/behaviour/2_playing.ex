defmodule Websocket.ServerRoom.PlayingBehaviour do
    alias Websocket.ServerRoom, as: ServerRoom
    alias Websocket.ServerRoom.Room
    alias Websocket.ServerUser.User
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
    %Entity{attributes: %{Room => %{playingIndexList: playingIndexList} = room}} = entity) when length(playingIndexList) == 1 do
        send(self(), {:action, %{"aId" => @action_kaipai}})
        {:ok, entity}
    end

    def handle_event(:next_talk,
    %Entity{attributes: %{Room => room}} = entity) do
        currIndex = next_index(room.currIndex, length(room.playingIndexList))

        room = %{room | currIndex: currIndex}

        pos =  Enum.at(room.playingIndexList, currIndex)
        user = Map.get(room.users, pos)

        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        #{inspect currIndex} #{pos}"

        send(self(), {:notify_all, {:next_talk, pos}})
        # send(user.pid, :next_talk)
        {:ok, entity |> put_attribute(room)}
    end

    def handle_event({:action, %{"aId" => aId} = msg},
    %Entity{attributes: %{Room => room}} = entity) do

        room = handle_actions_(msg, Map.get(msg, "pos", -1), room)
        # if (aId == 4) do
            # {:become, Websocket.ServerRoom.EndingBehaviour, :ok, entity}
        # else
            {:ok, entity |> put_attribute(room)}
        # end
    end

    defp handle_actions_(%{"aId" => @action_kanpai}, pos, room) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        aId: #{@action_kanpai}."
        send(self(), {:notify_all, {:kanpai, pos}})
        room
    end

    defp handle_actions_(%{"aId" => @action_yazhu, "count" => count}, pos, room) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        aId：#{@action_yazhu}."
        send(self(), {:notify_all, {:yazhu, pos, count}})
        room
    end

    defp handle_actions_(%{"aId" => @action_qipai}, pos, room) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        aId：#{@action_qipai}."
        playingIndexList = room.playingIndexList |> List.delete(pos)
        currIndex = last_index(room.currIndex, length(playingIndexList))
        send(self(), {:notify_all, {:qipai, pos}})
        send(self(), :next_talk)
        %{room |
            currIndex: currIndex,
            playingIndexList: playingIndexList
        }
    end

    defp handle_actions_(%{"aId" => @action_kaipai}, _, _, room) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        aId：#{@action_kaipai}."
        users = Room.users
        max_user = users
        |> Enum.reduce(List.first(users), fn
            %User{poker: poker1} = item1, %User{poker: poker2} = acc ->
                if Websocket.Poker.compare_pokers?(poker1, poker2) do
                    acc
                else
                    item1
                end
        end)

        chips = room.chips |> Enum.reduce(0, fn {_, count},acc -> acc+count end)
        send(self(), {:notify_all, {:kaipai, {max_user.position, chips}}})
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