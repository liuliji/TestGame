defmodule Websocket.ServerRoom do

    alias Entice.Entity
    alias Websocket.ServerRoom.RoomAttr
    alias Websocket.ServerRoom.UnreadyedBehaviour
    require Logger

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
            chips: [], # 筹码{pos, count} pos位置的玩家 加注 count
        )
    end

    def start_link(roomId) do
        {:ok, pid} = Entity.start()
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        roomId: #{roomId} start"
        Registry.register(Websocket.Application.room_registry_name, roomId, pid)
        Entity.put_behaviour(pid, Websocket.ServerRoom.MainBehaviour, %Room{roomId: roomId, pid: pid})
        {:ok, pid}
    end

    defp via_tuple(roomId) do
        {:via, Registry, {Websocket.Application.room_registry_name, roomId}}
    end


    def behaviour_header do
        quote do
            alias Websocket.ServerRoom, as: ServerRoom
            alias Websocket.ServerRoom.Room
            require Logger
        
            use Entice.Entity.Behaviour
            alias Entice.Entity
        end
    end

    defmacro __using__(which) when is_atom(which) do
        apply(__MODULE__, which, [])
    end

    # ----------------- some method start---------------

    defdelegate room_info(pid), to: RoomAttr

    defdelegate users(pid), to: RoomAttr

    defdelegate jiazhu(pid, pos, count), to: RoomAttr

    def get_seat(pid, uid) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        get seat pid:#{inspect pid}, uid:#{inspect uid}"
        case Entity.call_behaviour(pid, UnreadyedBehaviour, {:takeSeat, uid}) do
            {:error, :not_found} ->
                -1
            ret ->
                ret
        end
    end

    def remove_seat(pid, uid) when is_bitstring(uid) do
        Entity.call_behaviour(pid, UnreadyedBehaviour, {:removeSeat, uid})
    end

    def remove_seat(pid, pos) when is_integer(pos) do
        Entity.call_behaviour(pid, UnreadyedBehaviour, {:removeSeat, pos})
    end

    # ----------------- some method end---------------

end