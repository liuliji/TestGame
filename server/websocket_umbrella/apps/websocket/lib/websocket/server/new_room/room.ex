defmodule Websocket.ServerRoom2 do

    alias Entice.Entity

    defmodule Room do
        defstruct(
            roomId: "",
            pid: nil,
            users: %{0 => nil,  #%{uid, pid, alreadyIn}
                    1 => nil,
                    2 => nil,
                    3 => nil,
                    4  => nil},
            playingIndexList: [],  #当前还在参与游戏的玩家座位号
            currIndex: -1,   # 当前发言玩家列表中的index
        )
    end

    def start_link(roomId) do
        {:ok, pid} = Entity.start([name: via_tuple(roomId)])
        Entity.put_behaviour(pid, Websocket.ServerRoom.MainBehaviour, %Room{roomId: roomId, pid: pid})
        {:ok, pid}
    end

    defp via_tuple(roomId) do
        {:via, Registry, {Websocket.Application.room_registry_name, roomId}}
    end


    def behaviour_header do
        quote do
            alias Websocket.ServerRoom2, as: ServerRoom
            alias Websocket.ServerRoom2.Room
            require Logger
        
            use Entice.Entity.Behaviour
            alias Entice.Entity
        end
    end

    defmacro __using__(which) when is_atom(which) do
        apply(__MODULE__, which, [])
    end

end