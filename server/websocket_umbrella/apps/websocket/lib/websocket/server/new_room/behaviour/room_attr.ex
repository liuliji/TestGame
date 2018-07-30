defmodule Websocket.ServerRoom.RoomAttr do
    # use Websocket.ServerRoom2, :behaviour_header
    alias Websocket.ServerRoom2, as: ServerRoom
    alias Websocket.ServerRoom2.Room
    require Logger

    alias Entice.Entity

    # Entity.get_attribute 这种方式最后也是调用的 Attribute.Behaviour 的相关方法 然后发送同步消息 获取信息
    # 所以也可以说 该模块是对 Attribute.Behaviour 模块的封装
    # 所以 应该注意，获取的相关消息，全是发送的同步消息

    def room_info(pid) do
        Entity.get_attribute(pid, Room)
    end


end