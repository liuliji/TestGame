defmodule Websocket.ServerRoom do
    require Logger
    alias Entice.Entity
    alias Websocket.ServerRoom.Room
    alias Websocket.ServerRoom.DefaultBehaviour
    alias Entice.Entity.Coordination
    alias Websocket.ServerUser.User

    defmodule Room do
        defstruct(
            roomId: "",
            pid: nil,
            users: []
        )
    end

    def new_room(roomId) do
        {:ok, pid} = Entity.start(roomId)
        Entity.put_behaviour(pid, DefaultBehaviour, %Room{roomId: roomId, pid: pid})
        {:ok, pid}
    end

    @doc """
    return user pid list
    eg. [pid, pid]
    """
    def get_users(pid) do
        Entity.call_behaviour(pid, DefaultBehaviour, :getUsers)
    end

    def del_room(pid) do
        
    end

    def room_info(pid) do
        Entity.get_attribute(pid, Room)
    end

    def join_room(roomId, userPid) do
        Coordination.register(userPid, roomId)
    end

    defmodule DefaultBehaviour do
        use Entice.Entity.Behaviour     #这句话添加了默认需要实现的方法
        require Logger
        alias Entice.Entity
        alias Entice.Entity.Coordination
        alias Websocket.ServerRoom.Room

        def init(entity, %{roomId: roomId, pid: pid} = args) do
            Logger.debug "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
            init room #{inspect args}"
            entity = put_attribute(entity, args)
            # Entice.Entity.Coordination.register(pid, roomId)
            {:ok, entity}
        end

        def handle_call({:joinRoom, uid},
        %Entity{
            attributes: %{users: users} = attr
        } = entity) do
            {:ok, %{}, entity}
        end

        def terminate(reason, entity) do
            Logger.debug "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
            destory room  reason:#{inspect reason}, entity: #{inspect entity}"
            {:ok, entity}
        end

        def handle_call(:getUsers,
        %Entity{attributes: %{Room => room}} = entity) do
            {:ok, room.users |> Enum.map(fn pid -> Websocket.ServerUser.user_info(pid) end), entity}
        end

        def handle_event({:join, %{uid: uid, pid: pid} = user},
        %Entity{attributes: %{Room => room}} = entity) do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            get join msg. user:#{inspect user}, room:#{inspect room}"
            room = %{room | users: [pid | room.users]}
            entity = put_attribute(entity, room)
            send(pid, {:joinSuccess, room.roomId})
            Coordination.register(pid, room.roomId)
            {:ok, entity}
        end
    end

end