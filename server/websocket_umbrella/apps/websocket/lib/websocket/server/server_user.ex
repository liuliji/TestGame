defmodule Websocket.ServerUser do
    require Logger
    alias Entice.Entity
    alias Entice.Entity.Coordination

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

    defmodule DefaultBehaviour do
        use Entice.Entity.Behaviour
        require Logger
        alias Websocket.ServerUser.User

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

        def handle_event(:joinLobby, entity) do
            {:ok, update_user(entity, :roomId, WebsocketWeb.HallRoomChannel.get_lobby_name())}
        end

        def handle_event({:join, roomId}, entity) do
            entity = update_user(entity, :roomId, roomId)
            Coordination.
            {:ok, entity}
        end

        def handle_event({:entity_join, %Entity{id: id}},
        %Entity{id: id} = entity) do
        
            Logger.debug "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
            自己收到了 自己加入房间的消息"
            {:ok, entity}
        end

        def handle_event({:entity_join, %{attributes: %{} = inital_attributes} = new_entity},
        %Entity{attributes: %{User => user}} = entity) do
            newUser = get_attribute(new_entity, User)
            user = get_attribute(entity, User)
            send(user.socketPid, {:joinedRoom, newUser})
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