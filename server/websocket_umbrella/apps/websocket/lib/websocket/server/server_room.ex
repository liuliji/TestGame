defmodule Websocket.ServerRoom do
    require Logger
    alias Entice.Entity
    alias Websocket.ServerRoom.Room
    alias Websocket.ServerRoom.DefaultBehaviour
    alias Entice.Entity.Coordination

    defmodule Room do
        defstruct(
            roomId: "",
            pid: nil,
            users: []
        )
    end

    def new_room(roomId) do
        {:ok, pid} = Entity.start(roomId)
        Entity.put_behaviour(pid, %Room{roomId: roomId, pid: pid})
        {:ok, pid}
    end

    def del_room(pid) do
        
    end

    def room_info(pid) do
        Entity.get_attribute(pid, Room)
    end

    def join_room(roomId, userPid) do
        Coordination.register(userPid, roomId)
    end

    defmodule Websocket.ServerRoom.DefaultBehaviour do
        use Entice.Entity.Behaviour     #这句话添加了默认需要实现的方法
        require Logger
        alias Entice.Entity
        alias Entice.Entity.Coordination

        def init(entity, %{roomId: roomId, pid: pid} = args) do
            Logger.debug "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
            init room #{inspect args}"
            put_attribute(entity, args)
            # Entice.Entity.Coordination.register(pid, roomId)
            {:ok, entity}
        end

        def handle_call({:joinRoom, uid},
        %Entity{
            attributes: %{users: users} = attr
        } = entity) do
            {:ok, entity}
        end

        def terminate(reason, entity) do
            Logger.debug "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
            destory room  reason:#{inspect reason}, entity: #{inspect entity}"
            {:ok, entity}
        end
    end

end