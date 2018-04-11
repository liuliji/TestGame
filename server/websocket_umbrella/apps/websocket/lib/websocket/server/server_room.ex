defmodule Websocket.ServerRoom do
    require Logger
    alias Entice.Entity
    alias Websocket.ServerRoom.Room
    alias Websocket.ServerRoom.DefaultBehaviour
    alias Entice.Entity.Coordination
    alias Websocket.ServerUser.User


    # 最完美的方案就是 数据全部都在 server_room 接收到了消息之后，开始设置。
    # user_room只在server_room返回的消息里面更新数据，从client传递过来的消息仅仅是传递，因为并不能保证server_room能接收到消息，
    # 如果必须要在 user_room接收client的消息里面更新用户数据，那么这种数据最好是可以重写的，就是它并不是 下一次再发起这种消息的时候的基础数据。
    # 

    defmodule Room do
        defstruct(
            roomId: "",
            pid: nil,
            users: [],       # 存放的user {uid, pid}
            seats: [nil, nil, nil, nil, nil]    #存放的user id
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

    @doc """
        param1 roomPid, param2 uid
        找到了座位 返回>0 没找到 返回-1
    """
    def get_seat(pid, uid) do
        Entity.call_behaviour(pid, DefaultBehaviour, {:takeSeat, uid})
    end

    def remove_seat(pid, uid) when is_bitstring(uid) do
        Entity.call_behaviour(pid, DefaultBehaviour, {:removeSeat, uid})
    end

    def remove_seat(pid, pos) when is_integer(pos) do
        Entity.call_behaviour(pid, DefaultBehaviour, {:removeSeat, pos})
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
            {:ok, room.users |> Enum.map(fn {uid, pid} -> Websocket.ServerUser.user_info(pid) end), entity}
        end

        @doc """
        找到了座位 返回>0 没找到 返回-1
        """
        def handle_call({:takeSeat, uid}, entity) do
            room = entity |> get_attribute(Room)
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            finding seat... room： #{inspect room}"
            index =
            if (room.seats |> Enum.member?(uid)) do
                room.seats |> Enum.find_index(fn x -> x==uid end)
            else
                {isFind, pos} = room.seats |> Enum.reduce({false, 0}, fn x, {isFind, pos} ->
                    if (isFind) do
                        {isFind, pos}
                    else
                        if (x == nil) do
                            {true, pos}
                        else
                            {isFind, pos = pos + 1}
                        end
                    end
                end)

                if (isFind) do
                    Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                    find the seat pos:#{inspect pos}"
                    room = %{room | seats: room.seats |> List.update_at(pos, fn x -> uid end)}
                    entity = entity |> put_attribute(room)
                    Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                    room seats updated ：#{inspect room}"
                    pos
                else
                    -1
                end
            end

            # 更新user 这里不应该更新 应该在user真正加入房间的时候再更新，而且这时候 根本获取不到user信息
            # 这里只是 预占座
            # {^uid, pid} = List.keyfind(room.users, uid, 0)
            # Websocket.ServerUser.update_seat(pid, index)

            {:ok, index, entity}
        end

        def handle_call({:removeSeat, uid}, entity) when is_bitstring(uid) do
            room = get_attribute(entity, Room)
            case room.seats |> Enum.find_index(fn x -> x==uid end) do
                nil ->
                    {:ok, %{}, entity}
                pos ->
                    room = %{room | seats: room.seats |> List.update_at(pos, fn x -> nil end)}
                    {:ok, %{}, entity |> put_attribute(room)}
            end

        end

        def handle_call({:removeSeat, pos}, entity) when is_integer(pos) do
            room = get_attribute(entity, Room)
            room = %{room | seats: room.seats |> List.update_at(pos, fn x -> nil end)}
            {:ok, %{}, entity |> put_attribute(room)}
        end

        def handle_event({:join, %{uid: uid, pid: pid} = user},
        %Entity{attributes: %{Room => room}} = entity) do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            get join msg. user:#{inspect user}, room:#{inspect room}"

            if(length(room.users) == 0) do
                Websocket.ServerUser.update_info(pid, :roomOwner, true)
            end

            room = %{room | users: [{uid, pid} | room.users]}
            entity = put_attribute(entity, room)
            send(pid, {:joinSuccess, room.roomId})
            send(self(), {:notify_all, {:joined, user}})
            {:ok, entity}
        end

        def handle_event({:notify_all, msg},
        %Entity{attributes: %{Room => room}} = entity) do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            notify_all msg:#{inspect msg}. room.users:#{inspect room.users}"
            room.users |> Enum.map(fn {uid, pid} -> send(pid, msg) end)
            {:ok, entity}
        end

        def handle_event({:leaveRoom, uid},
        %Entity{attributes: %{Room => room}} = entity) do
            {^uid, pid} = room.users |> List.keyfind(uid, 0)
            room = %{room | users: room.users |> List.keydelete(uid,  0),
                            seats: room.seats |> List.delete(uid)}
            entity = put_attribute(entity, room)
            send(pid, :leavedRoom)
            send(self(), {:notify_all, :user_updated})
            {:ok, entity}
        end
    end

end