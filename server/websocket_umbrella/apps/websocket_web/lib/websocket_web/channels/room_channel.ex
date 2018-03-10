defmodule WebsocketWeb.RoomChannel do
    use Phoenix.Channel
    require Logger


    ## ----------- Callbacks start----------------
    # channel 也可以通过message来认证 是否用户有权限加入该房间
    # 因为如果接收和发送这个channel Pubsub events，就必须加入该channel啊
    def join("room:lobby", _message, socket) do
        Logger.debug "join channel room:lobby"
        Logger.debug "msg:#{inspect _message}"
        Logger.debug "socket: #{inspect socket}"
        {:ok, socket}
    end

    def join("room:" <> _private_room_id, _params, _socket) do
        Logger.debug "join unnamed room"
        {:error, %{reason: "unauthorized"}}
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
    intercept ["new_msg"]

    ### 我有问题啊，既然intercept 针对的是topic，那么应该也可以拦截 push 的消息
    def handle_out("new_msg", msg, socket) do
        Logger.debug "handle out new_msg topoc, return msg:#{inspect msg}"
        push socket, "new_msg", msg |> Map.put(:is_handle_out, true)
        {:reply, :ok, socket}
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

    def termiate(reason, socket) do
        Logger.info "client live socket:#{inspect socket.id}. reason:#{inspect reason}"
        :ok
    end


    ## ----------------- Terminate start ----------------
end