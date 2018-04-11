defmodule Websocket.ServerUser do
    require Logger
    alias Entice.Entity
    alias Entice.Entity.Coordination
    alias Websocket.ServerUser.DefaultBehaviour

    @doc """
    User struct.
    :uid, :roomId, :userName, :socketId
    """
    defmodule User do

        @type t :: %User{
            # 用户基本信息
            uid: String.t,
            userName: String.t,
            online: boolean,

            pid: pid,
            socketPid: pid,
            channelPid: pid,

            # 房间信息
            roomId: String.t,
            roomOwner: boolean,
            position: integer,
            readyStatus: boolean,
            
            roomPid: pid
            
        }

        defstruct(
            uid: "",
            userName: "",
            online: true,
            pid: nil,
            socketPid: nil,
            channelPid: nil,

            # inner 
            roomId: "",
            roomOwner: false,
            position: -1,
            readyStatus: false,
            roomPid: nil
            )
    end

    def start(uid, userName, socketPid) do
        {:ok, pid} = Entity.start(uid)
        Entity.put_behaviour(pid, DefaultBehaviour, %User{uid: uid, userName: userName, pid: pid, socketPid: socketPid})
        {:ok, pid}
    end

    def user_info(pid) do
        Entity.get_attribute(pid, User)
    end

    def update_seat(pid, value) do
        Entity.call_behaviour(pid, DefaultBehaviour, {:update_info, :position, value})
    end

    def update_info(pid, key, value) do
        Entity.call_behaviour(pid, DefaultBehaviour, {:update_info, key, value})
    end

    def leave_channel(pid) do
        # 这里如果 设置为null的话，如果客户端掉线了 send(nil, msg)就会出问题，所以直接往不存在的process发消息就可以了
        # Entity.call_behaviour(pid, DefaultBehaviour, {:update_info, :channelPid, nil})
    end

    defmodule DefaultBehaviour do
        use Entice.Entity.Behaviour
        require Logger
        alias Websocket.ServerUser.User
        alias Entice.Entity

        def init(entity, args) do
            entity = put_attribute(entity, args)
            Process.monitor(args.socketPid)
            {:ok, entity}
        end

        
        def terminate(reason,
        %Entity{attributes: %{User => user}} = entity) do
            leave_room(user)
            Logger.info "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
            user server exit reason:#{inspect reason} \nuser:#{inspect get_attribute(entity, User)}"
            {:ok, entity}
        end

        def handle_event({:DOWN, _, _, _, reason} = msg, entity) do
            Logger.info "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            user client disconnected #{inspect msg}. entity: #{inspect entity}"
            {:stop, %{reason: "client disconnect"}, entity}
        end

        def handle_call({:update_info, key, value}, entity) do
            entity = update_user(entity, key, value)
            {:ok, get_attribute(entity, User), entity}
        end

        def handle_event({:joinLobby, channelPid}, entity) do
            {:ok, entity |> update_user(:roomId, WebsocketWeb.HallRoomChannel.get_lobby_name()) |> update_user(:channelPid, channelPid)}
        end

        def handle_event({:join, roomId, channelPid}, entity) do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            receive msg join #{inspect roomId} "
            user = entity |> get_attribute(User)
            entity = put_attribute(entity, %{user | channelPid: channelPid})
            send(get_room_pid(roomId), {:join, user})
            {:ok, entity}
        end

        # 自己受到的joined 消息
        def handle_event({:joined, %User{uid: uid} = newUser},
        %Entity{attributes: %{User => %{uid: uid} = user}} = entity) do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            self receive joined msg. #{inspect user.uid} receive #{inspect newUser.uid} join room"
            {:ok, entity}
        end

        def handle_event({:joined, %User{} = newUser},
        %Entity{attributes: %{User => user}} = entity) do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            others receive joined msg. #{inspect user.uid} receive #{inspect newUser.uid} join room"
            user = get_attribute(entity, User)
            send(user.channelPid, {:joined, newUser})
            {:ok, entity}
        end

        def handle_event({:joinSuccess, roomId} = msg,
        %Entity{attributes: %{User => user}} = entity) do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            joinSuccess roomId:#{inspect roomId}, user:#{inspect user}"
            entity = update_user(entity, :roomId, roomId)
            seat = Websocket.ServerRoom.get_seat(Websocket.RoomManager.get_room_pid(roomId), user.uid)
            entity = update_user(entity, :position, seat)
            # roomPid
            send(user.channelPid, msg)
            {:ok, entity}
        end

        def handle_event(:leaveRoom,
        %Entity{attributes: %{User => user}} = entity) do
            leave_room(user)
            {:ok, entity}
        end

        def handle_event(:leavedRoom,
        %Entity{attributes: %{User => user}} = entity) do
            channelPid = user.channelPid
            entity = entity |> update_user(:channelPid, nil)
                    |> update_user(:roomPid, nil)
                    |> update_user(:roomId, "")
                    |> update_user(:position, -1)
                    |> update_user(:readyStatus, false)
                    |> update_user(:roomOwner, false)
            send(channelPid, :leavedRoom)
            {:ok, entity}
        end

        def handle_event(:user_updated,
        %Entity{attributes: %{User => user}} = entity) do
            send(user.channelPid, :user_updated)
            {:ok, entity}
        end


        # ------------- private mothod -----------------
        defp update_user(entity, key, value) do
            user = %{get_attribute(entity, User) | key => value}
            entity = entity |> put_attribute(user)
        end

        defp leave_room(user) do
            send(get_room_pid(user.roomId), {:leaveRoom, user.uid})
        end

        defp get_room_pid(roomId) do
            Websocket.RoomManager.get_room_pid(roomId)
        end

    end

end