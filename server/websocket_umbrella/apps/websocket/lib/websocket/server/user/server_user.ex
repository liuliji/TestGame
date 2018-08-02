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
            curMoney: integer,
            originMoney: integer,

            pid: pid,
            socketPid: pid,
            channelPid: pid,

            # 房间信息
            roomId: String.t,
            roomOwner: boolean,
            position: integer,
            readyStatus: boolean,
            
            roomPid: pid,

            # 牌信息
            poker: Websocket.Poker.t
            
        }

        defstruct(
            uid: "",
            userName: "",
            curMoney: 0,
            originMoney: 100,
            online: true,
            pid: nil,
            socketPid: nil,
            channelPid: nil,

            # inner 
            roomId: "",
            roomOwner: false,
            position: -1,
            readyStatus: false,
            roomPid: nil,

            poker: nil
            )
    end

    def start_link(uid, userName, socketPid) do
        {:ok, pid} = Entity.start()
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        start user uid:#{uid} uname:#{userName}"
        Registry.register(Websocket.Application.user_registry_name, uid, pid)
        Entity.put_behaviour(pid, DefaultBehaviour, %User{uid: uid, userName: userName, pid: pid, socketPid: socketPid})
        {:ok, pid}
    end

    defp via_tuple(uid) do
        {:via, Registry, {Websocket.UserRegistry, uid}}
    end

    def user_info(pid) do
        Entity.get_attribute(pid, User)
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

        use Websocket.ServerUser_In
        use Websocket.ServerUser_Out

        def init(entity, args) do
            entity = put_attribute(entity, args)
            Process.monitor(args.socketPid)
            {:ok, entity}
        end

        
        def terminate(reason,
        %Entity{attributes: %{User => user}} = entity) do
            # send(get_room_pid(user.roomId), {:leaveRoom, user.uid})
            Logger.info "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
            user server exit reason:#{inspect reason} \nuser:#{inspect get_attribute(entity, User)}"
            {:ok, entity}
        end

        def handle_event({:DOWN, _, _, _, reason} = msg, entity) do
            Logger.info "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            user client disconnected #{inspect msg}. entity: #{inspect entity}"
            {:stop_process, {:shutdown, "user client disconnected"}, entity}
        end

        def handle_call({:update_info, key, value}, entity) do
            entity = update_user(entity, key, value)
            {:ok, get_attribute(entity, User), entity}
        end

        def handle_event(:user_changed,
        %Entity{attributes: %{User => user}} = entity) do
            send(user.channelPid, :user_changed)
            {:ok, entity}
        end

        # ------------- private mothod -----------------
        defp update_user(entity, key, value) do
            user = %{get_attribute(entity, User) | key => value}
            entity = entity |> put_attribute(user)
        end

        defp get_room_pid(roomId) do
            Websocket.RoomSupervisor.find_room(roomId)
        end

    end

end