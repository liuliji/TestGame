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
            deltaMoney: integer,

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
            curMoney: 100,  # 牌局过程中，会一直更新该数据
            originMoney: 100,   # 牌局过程中，他一直是开牌前的数据，牌局结束，结算的时候，会将该数据更新回curMoney
            deltaMoney: 0, #上一具的输赢信息
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
        # 原来是有一种启动方式 能在启动的时候自动注册 到Registry中，保证启动了 就肯定能注册了
        # 后来不好使，但是代码必须写到这，因为 Registry 是注册当前进程到 注册表的
        # 而且，注册进来的进程死了之后，会自动从registry中删除
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

        def handle_event({:DOWN, _, _, terminated_pid, reason} = msg,
        %Entity{attributes: %{User => user}} = entity) do

            user_channel_pid = user.channelPid

            case terminated_pid do
                user_channel_pid ->
                    Logger.info "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                    user client disconnected,
                    user:#{inspect user}"

                    # 没有加入房间 或者是 加入了房间 但不是准备状态
                    # 是真的退出了
                    isRealDisconn = is_nil(user.roomPid) || !user.readyStatus

                    if (isRealDisconn) do
                        Logger.info "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                        not in room, so quit"
                        # 用户退出 删除用户保存在 ets 中的信息 
                        :ets.delete(:ets_user, user.userName)
                        send(user.roomPid, {:leaveRoom, user.uid})
                        Logger.info "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                        delete user in ets, user#{inspect user}"
                        {:stop_process, {:shutdown, "user client disconnected"}, entity}
                    else
                        Logger.info "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                        in room #{inspect user.roomId}, so disconnected"
                        # 用户掉线了 更新相关状态
                        {:ok, entity |> update_user(:channelPid, nil) |> update_user(:online, false) |> update_user(:socketPid, nil)}
                    end
                unknow_pid ->
                    Logger.info "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                    unknow process #{unknow_pid} terminated cause user terminated"
                    # 不知名 用户退出 删除用户保存在 ets 中的信息 
                    :ets.delete(:ets_user, user.userName)
                    send(user.roomPid, {:leaveRoom, user.uid})
                    
                    Logger.info "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                    delete user in ets, user#{inspect user}"
                    {:stop_process, {:shutdown, "unknow process #{unknow_pid} terminated"}, entity}
            end
            # TODO user 断线重连 状态判断已经ok，还差 返回信息的定义。
            # TODO 下面主要就是房间没人了退出，游戏结束了，断线的退出，
            # TODO 断线了，判断 是掉线，还是直接退出 ok完成
            # TODO 断线了，重连与不重连，
            # TODO 房间 怎么处理，房主 掉了 怎么搞，
            # TODO 用户的细节处理完了，房间的细节处理
            
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