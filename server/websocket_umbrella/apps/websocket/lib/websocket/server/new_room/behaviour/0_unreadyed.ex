defmodule Websocket.ServerRoom.UnreadyedBehaviour do
    alias Websocket.ServerRoom, as: ServerRoom
    alias Websocket.ServerRoom.Room
    require Logger

    use Entice.Entity.Behaviour
    alias Entice.Entity

    def init(%Entity{attributes: %{Room => room}} = entity, :ok) do
        room = %{room | currIndex: -1}
        {:ok, entity |> put_attribute(room)}
    end

    #-------------------- msg callback start-----------------------

    def handle_event({:join, %{uid: uid, pid: pid} = user},
    %Entity{attributes: %{Room => room}} = entity) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        get join msg. user:#{inspect user}, room:#{inspect room}"

        roomOwner = user_size_(room.users) == 0
        
        {pos, _} = get_seat_(room.users, uid)
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        #{inspect uid} get pos #{inspect pos}"
        if (pos == -1) do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            #{inspect uid} join room failed.
            room:#{inspect room}"
            {:ok, entity}
        else
            room = %{room | users: %{room.users | pos => %{uid: uid, pid: pid, alreadyIn: true}}}
            entity = put_attribute(entity, room)
            send(pid, {:joinSuccess, {room.roomId, pos, roomOwner}})
            send(self(), {:notify_all, {:joined, uid}})
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            #{inspect uid} joined room success.
            room: #{inspect room}"
            {:ok, entity}
        end

    end

    def handle_event({:ready, uid},
    %Entity{attributes: %{Room => room}} = entity) do
        all_ready = room
        |> ServerRoom.users
        |> Enum.reduce(true, fn item, acc ->
            item.readyStatus && acc
        end)

        if all_ready do
            send(self(), :startGame)
        else
            send(self(), {:notify_all, {:readyed, uid}})

        end
        
        {:ok, entity}
    end

    def handle_event({:cancelReady, uid},
    %Entity{attributes: %{Room => room}} = entity) do
        send(self(), {:notify_all, {:canceledReady, uid}})
        {:ok, entity}
    end

    def handle_event(:startGame,
    %Entity{attributes: %{Room => room}} = entity) do
        # 按照我们现在的设计 ，开始游戏之前是应该检查一下 seat中的用户和users中的用户是否一致的。
        #check_user_(entity)
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        #{room.roomId} starting game.
        room:#{inspect room}"
        {:become, Websocket.ServerRoom.StartingBehaviour, :ok, entity}
    end

    def handle_event({:leaveRoom, uid},
    %Entity{attributes: %{Room => room}} = entity) do

        {pos, user} = get_seat_(room.users, uid)
        room = %{room | users: room.users |> Map.put(pos, nil)}
        entity = put_attribute(entity, room)
        send(user.pid, :leavedRoom)
        send(self(), {:notify_all, {:othersLeavedRoom, pos}})
        {:ok, entity}
    end

    def handle_event({:dissolveRoom, uid},
    %Entity{attributes: %{Room => room}} = entity) do
        {pos, %{pid: pid}} = get_seat_(room.users, uid)
        user = Websocket.ServerUser.user_info(pid)
        if user.roomOwner do
            {:stop_process, {:shutdown, :dissolveRoom}, entity}
        else
            {:ok, entity}
        end
    end

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

    #-------------------- msg callback end-----------------------

    #-------------------- private method start ---------------------

    defp user_size_(users) do
        users
        |> Enum.filter(fn 
            {pos, nil} -> false
            {pos, _} -> true
        end)
        |> length
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

    #-------------------- private method start ---------------------
end