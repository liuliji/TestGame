defmodule Websocket.ServerRoom.RoomAttr do
    # use Websocket.ServerRoom, :behaviour_header
    alias Websocket.ServerRoom, as: ServerRoom
    alias Websocket.ServerRoom.Room
    require Logger

    alias Entice.Entity

    # Entity.get_attribute 这种方式最后也是调用的 Attribute.Behaviour 的相关方法 然后发送同步消息 获取信息
    # 所以也可以说 该模块是对 Attribute.Behaviour 模块的封装
    # 所以 应该注意，获取的相关消息，全是发送的同步消息

    def room_info(pid) do
        Entity.get_attribute(pid, Room)
    end

    def users(pid) when is_pid(pid) do
        roomInfo = Entity.get_attribute(pid, Room)
        users(roomInfo)
    end

    def users(%Room{} = room) do
        room.users
        |> Enum.filter(fn
            {pos, nil} -> false
            {pos, _} -> true
        end)
        |> Enum.map(fn {pos, %{pid: pid}} -> Websocket.ServerUser.user_info(pid) end)
    end

    def jiazhu(pid, pos, count) do
        Entity.update_attribute(pid, Room, fn
            %Room{chips: chips} = room -> 
                %{room | chips: [{pos, count} | room.chips]}
        end)
    end


end