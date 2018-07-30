defmodule WebsocketWeb.RoomsChannel do
    use Phoenix.Channel
    require Logger
    alias Websocket.RoomSupervisor

    use WebsocketWeb.RoomsChannel_In
    use WebsocketWeb.RoomsChannel_Out

    def get_user_uid(socket), do: socket.assigns.uid
    def get_user_pid(socket), do: socket.assigns.pid
    def get_user_roomId(socket), do: socket.assigns.roomId
    def get_user_roomPid(socket), do: RoomSupervisor.find_room(socket.assigns.roomId)

    ## ----------- Callbacks start----------------
    # channel 也可以通过message来认证 是否用户有权限加入该房间
    # 因为如果接收和发送这个channel Pubsub events，就必须加入该channel啊
    def join("room:" <> privateRoomId, msg, socket) do

        send(get_user_pid(socket), {:join, privateRoomId, socket.channel_pid})
        {:ok, socket}
    end
    ## -----------------Callbacks end -------------------

    ## ---------------Incoming Events start-------------------
    # 当client join in channel之后，发送进来的消息就会被路遥到 handle_in/3来处理
    # 可以通过 broadcast!/3 来给每一个listener发消息，或者通过push/3将消息推送到套接字上
    def handle_in("new_msg", msg, socket) do
        Logger.debug "get msg form client msg:#{inspect msg}"
        # broadcast!(socket, "new_msg", %{uid: uid})
        push(socket, "server_msg", %{msg: "server return msg"})
        Logger.debug "send to client. topic:server_msg"
        {:reply, :ok, socket}
    end

    def handle_in("ID_C2S_TALK", %{"content" => content} = msg, socket) do
        # user = get_user(socket)
        # Phoenix.Channel.broadcast!(socket, "ID_S2C_TALK", %{userId: user.uid, content: content})
        {:noreply, socket}
    end

    def handle_in("ID_C2S_DELETE_ROOM", %{"roomId" => roomId} = msg, socket) do
        Phoenix.Channel.broadcast!(socket, "ID_S2C_DELETE_ROOM", %{content: "room was deleted"})
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        user #{inspect socket.assigns.uid} delete room"
        {:stop, :normal, socket}
    end


    # 关于 hand_in的返回值
    # {:reply, {:ok, response}|:ok, socket}
    # {:reply, {:error, reson}|:error, socket}
    # {:noreply, socket} 
    # 如果:reply，则直接返回给客户端一个消息，比如说 这是一个修改操作，
    # 成功与否需要告诉客户端，然后再通过socket来通知、刷新等有其他操作。

    ## ---------------Incoming Events end-------------------


    ## ---------------Intercepting Outgoing Events start-------------------
    # 当时间通过 broadcast!/3 广播之后，每一个channel的订阅者可以通过
    # intercept/1 来打断event，并触发 handle_out/3 回调
    intercept ["new_msg", "ID_S2C_TALK"]

    ### 我有问题啊，既然intercept 针对的是topic，那么应该也可以拦截 push 的消息
    def handle_out("new_msg", msg, socket) do
        Logger.debug "handle out new_msg topoc, return msg:#{inspect msg}"
        push socket, "new_msg", msg |> Map.put(:is_handle_out, true)
        {:noreply, socket}
    end

    def handle_out("ID_S2C_TALK", msg, socket) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        ID_S2C_TALK talk #{inspect msg}"
        Phoenix.Channel.push(socket, "ID_S2C_TALK", msg)
        {:noreply, socket}
    end

    ## ---------------Intercepting Outgoing Events start-------------------




    ## ----------------- Terminate start ----------------
    # 关闭的时候，会回调 termiate/2 方法。和GenServer的类似
    
    # client left，reson = {:shutdown, :left}
    # client closed, reason = {:shutdown, :closed}

    # 任何回调返回 :stop 元祖，也会触发该方法，并且 reason 也会被传递到这里
    # {:stop, :normal, socket} 正常退出， linked process 也都会退出
    # {:stop, :shutdown|{:shutdown, msg}, socket} 正常退出，linked process 如果没有被 trapped，也会退出
    # others, like {:stop, {:error, msg}, socket} 退出会被日志记录，并且会被重启(在 transient mode)， linked process 也会以同样的原因退出除非被 trapped。
    #

    def terminate(reason, socket) do
        Logger.info "client live socket:#{inspect socket.id}. reason:#{inspect reason}"
        Websocket.ServerUser.leave_channel(get_user_pid(socket))
        :ok
    end


    ## ----------------- Terminate end ----------------

    defp get_client_user(%Websocket.ServerUser.User{} = user) do
        user |> Map.from_struct |> Map.delete(:pid) |> Map.delete(:socketPid) |> Map.delete(:roomPid) |> Map.delete(:channelPid)
    end

    defp get_client_room(%Websocket.ServerRoom.Room{} = room) do
        room |> Map.from_struct |> Map.delete(:pid) |> Map.delete(:users)
    end

end