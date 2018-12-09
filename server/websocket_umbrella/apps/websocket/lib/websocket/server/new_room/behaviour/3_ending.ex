defmodule Websocket.ServerRoom.EndingBehaviour do
    alias Websocket.ServerRoom, as: ServerRoom
    alias Websocket.ServerRoom.Room
    alias Websocket.ServerUser.User
    require Logger

    use Entice.Entity.Behaviour
    alias Entice.Entity

    def init(entity, {:ok, msg}) do
        send(self(), {:kaipai, msg})
        {:ok, entity}
    end

    def handle_event({:kaipai, msg},
    %Entity{attributes: %{Room => room}} = entity) do

        users = room.users
        |> Enum.filter(fn
            {pos, nil} -> false
            {pos, _} -> true
        end)
        |> Enum.map(fn {pos, %{pid: pid}} -> Websocket.ServerUser.user_info(pid) end)

        # 清除 user ready 状态
        users
        |> Enum.each(fn item -> 
            Websocket.ServerUser.update_info(item.pid, :readyStatus, false)
        end)

        # 清除 room 相关状态
        room = %{room |
            currIndex: -1
        }


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

        {:become, Websocket.ServerRoom.EndedBehaviour, {:ok, {max_user.position, chips}}, entity |> put_attribute(room)}
    end
end