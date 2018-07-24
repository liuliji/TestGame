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
            users: %{0 => nil,  #%{uid, pid, alreadyIn}
                    1 => nil,
                    2 => nil,
                    3 => nil,
                    4  => nil},
            playingIndexList: [],  #当前还在参与游戏的玩家座位号
            currIndex: -1,   # 当前发言玩家列表中的index
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
        alias Websocket.Poker

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

        def terminate(reason, entity,
        %Entity{attributes: %{Room => room}} = entity) do
            Logger.info "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
            destory room  reason:#{inspect reason}, entity: #{inspect entity}"

            send(self(), {:notify_all, :dissolvedRoom})
            Websocket.RoomManager.delete_room(room.roomId)
            {:ok, entity}
        end

        def handle_call(:getUsers,
        %Entity{attributes: %{Room => room}} = entity) do
            {:ok,
            room.users |> Enum.filter(fn
                {pos, nil} -> false
                {pos, _} -> true end)
                |> Enum.map(fn {pos, %{pid: pid}} -> Websocket.ServerUser.user_info(pid) end),
            entity}
        end

        @doc """
        找到了座位 返回>0 没找到 返回-1
        """
        def handle_call({:takeSeat, uid}, entity) do
            room = entity |> get_attribute(Room)
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            finding seat... room： #{inspect room}"

            {pos, user} = get_seat_(room.users, uid)

            # 更新user 这里不应该更新 应该在user真正加入房间的时候再更新，而且这时候 根本获取不到user信息
            # 这里只是 预占座 而且这里没有更新 
            # 注意这里并没有更新user的座位信息，只有当该user正确的加入房间的时候 才更新座位信息的，
            # 所以这里要注意如果没有加入成功 要删除该占座，以后可能需要处理

            {:ok, pos, entity}
        end

        def handle_call({:removeSeat, uid}, entity) when is_bitstring(uid) do
            room = get_attribute(entity, Room)
            {pos, _} = get_seat_(room.users, uid)
            if (pos == -1) do
                {:ok, %{}, entity}
            else
                room = %{room | users: room.users |> Map.put(pos, nil)}
                {:ok, %{}, entity |> put_attribute(room)}
            end

        end

        def handle_call({:removeSeat, pos}, entity) when is_integer(pos) do
            room = get_attribute(entity, Room)
            room = %{room | users: room.users |> Map.put(pos, nil)}
            {:ok, %{}, entity |> put_attribute(room)}
        end

        def handle_event({:join, %{uid: uid, pid: pid} = user},
        %Entity{attributes: %{Room => room}} = entity) do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            get join msg. user:#{inspect user}, room:#{inspect room}"

            roomOwner = (user_size_(room.users) == 0)
            
            {pos, _} = get_seat_(room.users, uid)
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            get pos #{inspect pos}"
            if (pos == -1) do
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                join room #{inspect entity}"
                {:ok, entity}
            else
                room = %{room | users: %{room.users | pos => %{uid: uid, pid: pid, alreadyIn: true}}}
                entity = put_attribute(entity, room)
                send(pid, {:joinSuccess, {room.roomId, pos, roomOwner}})
                send(self(), {:notify_all, {:joined, uid}})
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                joined room #{inspect entity}"
                {:ok, entity}
            end

        end

        def handle_event({:notify_all, msg},
        %Entity{attributes: %{Room => room}} = entity) do
            room.users |> Enum.map(fn
                {pos, %{pid: pid}} -> send(pid, msg)
                {pos, nil} -> nil
            end)
            {:ok, entity}
        end

        def handle_event({:leaveRoom, uid},
        %Entity{attributes: %{Room => room}} = entity) do

            {pos, user} = get_seat_(room.users, uid)
            room = %{room | users: room.users |> Map.put(pos, nil)}
            entity = put_attribute(entity, room)
            send(user.pid, :leavedRoom)
            send(self(), {:notify_all, :user_changed})
            {:ok, entity}
        end

        def handle_event({:dissolveRoom, uid},
        %Entity{attributes: %{Room => room}} = entity) do
            {pos, %{pid: pid}} = get_seat_(room.users, uid)
            user = Websocket.ServerUser.user_info(pid)
            if user.roomOwner do
                {:stop_process, %{msg: "dissolve room"}, entity}
            else
                {:ok, entity}
            end
        end

        def handle_event({:ready, uid},
        %Entity{attributes: %{Room => room}} = entity) do
            send(self(), {:notify_all, {:readyed, uid}})
            {:ok, entity}
        end

        def handle_event({:cancelReady, uid},
        %Entity{attributes: %{Room => room}} = entity) do
            send(self(), {:notify_all, {:canceledReady, uid}})
            {:ok, entity}
        end

        def handle_event({:startGame, uid},
        %Entity{attributes: %{Room => room}} = entity) do
            # 按照我们现在的设计 ，开始游戏之前是应该检查一下 seat中的用户和users中的用户是否一致的。
            #check_user_(entity)
            all_poker = Poker.init_all_poker()
            Enum.reduce(room.users, all_poker, fn
                {pos, %{pid: pid}}, all_poker ->
                    {poker, all_poker} = Poker.random_poker(all_poker)
                    send(pid, {:fapai, poker})
                    room = %{room | playingIndexList: [pos | room.playingIndexList]}
                    all_poker
                _, all_poker -> all_poker end)
            room = %{room | playingIndexList: :lists.sort(room.playingIndexList)}
            send(self(), :next_talk)
            
            {:ok, entity |> put_attribute(room)}
        end

        def handle_event(:next_talk,
        %Entity{attributes: %{Room => room}} = entity) do
            currIndex = if (room.currIndex == -1) do
                :random.uniform(length(room.playingIndexList)-1)
            else
                rem(room.currIndex+1, length(room.playingIndexList))
            end

            room = %{room | currIndex: currIndex}
            pos =  Enum.at(room.playingIndexList, currIndex)
            user = Map.get(room.users, pos)
            send(user.pid, :next_talk)
            {:ok, entity |> put_attribute(room)}
        end

        # -----------------private --------------
        defp user_size_(users) do
            Enum.reduce(users, 0,
                fn {pos, nil},acc -> acc
                {pos, _},acc -> acc+1 end)
        end

        defp get_seat_(users, uid) do

            #先找
            {pos, user} = Enum.find(users, {-1, nil}, fn
                {_, %{uid: ^uid}} -> true
                _ -> false end)

            if (pos == -1) do
                #找不到的话 再找一次 找不到的话 就不能加入了
                {pos, user} = Enum.find(users, {-1, nil}, fn
                    {_, nil} -> true
                    _ -> false end)
                {pos, user}
            else
                # 找到直接返回
                {pos, user}
            end

        end

        defp next_user_(room) do
            currIndex = room.currIndex
            nextIndex = rem(currIndex+1, length(room.playingIndexList))
            Enum.at(room.playingIndexList, nextIndex)
        end
    end

end