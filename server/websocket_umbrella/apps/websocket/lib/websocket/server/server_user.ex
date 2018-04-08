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

    defmodule DefaultBehaviour do
        use Entice.Entity.Behaviour
        require Logger
        alias Websocket.ServerUser.User
        alias Entice.Entity

        def init(entity, args) do
            entity = put_attribute(entity, args)
            {:ok, entity}
        end

        def terminate(reason,
        %Entity{attributes: attr} = entity) do
            Logger.info "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
            #{inspect get_attribute(attr, User)} exit"
            {:ok, entity}
        end

        def handle_call({:update_info, key, value}, entity) do
            entity = update_user(entity, key, value)
            {:ok, get_attribute(entity, User), entity}
        end

        def handle_event(:joinLobby, entity) do
            {:ok, update_user(entity, :roomId, WebsocketWeb.HallRoomChannel.get_lobby_name())}
        end

        def handle_event({:join, roomId, socketPid}, entity) do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            receive msg join #{inspect roomId} "
            user = entity |> get_attribute(User)
            entity = put_attribute(entity, %{user | socketPid: socketPid})
            send(get_room_pid(roomId), {:join, user})
            {:ok, entity}
        end

        def handle_event({:entity_join, %Entity{id: id}},
        %Entity{id: id} = entity) do
        
            Logger.debug "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
            myself receive entity_join msg. uid:#{id}"
            {:ok, entity}
        end

        def handle_event({:entity_join, %Entity{attributes: %{} = inital_attributes} = new_entity},
        %Entity{attributes: %{User => user}} = entity) do
            newUser = get_attribute(new_entity, User)
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            others receive entity_join msg. #{inspect user.uid} receive #{inspect newUser.uid} join room"
            user = get_attribute(entity, User)
            send(user.socketPid, {:joined, newUser})
            {:ok, entity}
        end

        def handle_event({:joined, %User{} = newUser},
        %Entity{attributes: %{User => user}} = entity) do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            others receive joined msg. #{inspect user.uid} receive #{inspect newUser.uid} join room"
            user = get_attribute(entity, User)
            send(user.socketPid, {:joined, newUser})
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
            send(user.socketPid, msg)
            {:ok, entity}
        end


        # ------------- private mothod -----------------
        defp update_user(entity, key, value) do
            user = %{get_attribute(entity, User) | key => value}
            entity = entity |> put_attribute(user)
        end

        defp get_room_pid(roomId) do
            Websocket.RoomManager.get_room_pid(roomId)
        end

    end

end