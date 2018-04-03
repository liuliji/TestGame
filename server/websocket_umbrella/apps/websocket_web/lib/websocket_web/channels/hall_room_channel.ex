defmodule WebsocketWeb.HallRoomChannel do
    use Phoenix.Channel
    require Logger
    alias Websocket.UserManager
    alias Phoenix.Socket

    @room_name "lobby"

    def get_lobby_name(), do: @room_name

    def get_user_pid(socket), do: socket.assigns.pid

    def get_user_uid(socket), do: socket.assigns.uid

    # `push`, `reply`, and `broadcast` can only be called after the socket has finished joining.
    def join(@room_name = room_name, msg, socket) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        #{socket.id} join channel #{room_name} msg:#{inspect msg}"
        # send(self(), {:afterJoin, msg})
        socket = socket |> Socket.assign(:roomId, room_name)
        send(get_user_pid(socket), :joinLobby)
        {:ok, socket}
    end
    
    def handle_in("ID_C2S_CREATE_ROOM", _msg, socket) do
        roomId = UUID.uuid4
        # 这里创建的room这个进程，所以当这个进程关闭的时候，这里创建的所有room进程都会关闭。
        # 这时候呢 我们就应该用roomManager来创建这个进程
        case Websocket.RoomManager.create_room(%{roomId: roomId}) do
            {:ok} ->
                Phoenix.Channel.push(socket, "ID_S2C_CREATE_ROOM_INFO", %{roomId: roomId})
                {:noreply, socket}
            {:error, msg} ->
                Websocket.ServerRoom.del_room(roomId)
                Phoenix.Channel.push(socket, "ID_S2C_CREATE_ROOM_FAILED", %{code: -1, reason: msg})
                {:noreply, socket}
        end
    end

    def handle_in("ID_C2S_JOIN_ROOM_ON_LOBBY", %{"roomId" => roomId} = msg, socket) do
        case Websocket.RoomManager.get_room_pid(roomId) do
            nil ->
                Logger.debug "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
                房间不存在 #{inspect msg}"
                {:noreply, socket}
            roomPid ->
                room = Websocket.ServerRoom.room_info(roomPid)
                # 这里需要占座，假装有人
                roomInfo = Map.from_struct(room) |> Map.delete(:users) |> Map.delete(:pid)
                Phoenix.Channel.push(socket, "ID_S2C_ROOM_INFO_ON_LOBBY", %{room: roomInfo})
                {:noreply, socket}
        end
    end

    def handle_in("ID_C2S_LOBBY_TALK", %{"content" => content} = msg, socket) do
        Logger.debug "#{inspect socket.id} say #{content}"
        Phoenix.Channel.broadcast!(socket, "ID_S2C_LOBBY_TALK", %{userId: get_user_uid(socket), content: content})
        {:noreply, socket}
    end

    intercept ["ID_C2S_LOBBY_TALK", "ID_S2C_JOIN_LOBBY_ROOM"]
    # handle_out can't reply
    # replies can only be sent from a `handle_in/3` callback
    def handle_out("ID_S2C_TALK", msg, socket) do
        Logger.debug "#{inspect socket.id} handle out talk topic, msg:#{inspect msg}"
        Phoenix.Channel.push socket, "ID_S2C_TALK", msg
        {:noreply, socket}
    end

    def handle_out("ID_S2C_JOIN_LOBBY_ROOM", msg, socket) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        #{inspect socket.id} handle out join topic, msg:#{inspect msg}"
        Phoenix.Channel.push socket, "ID_S2C_JOIN_LOBBY_ROOM", msg
        {:noreply, socket}
    end

    def terminate(reason, socket) do
        Logger.error "#{__MODULE__} termiatelive socket:#{inspect socket.id}. reason:#{inspect reason}"
        {:ok, assign(socket, :roomId, "")}
    end

    #----------- handle_info ------------------
    def handle_info({:afterJoin, _msg}, socket) do
        Phoenix.Channel.broadcast!(socket, "ID_S2C_JOIN_LOBBY_ROOM", %{uid: get_user_uid(socket), userName: socket.assigns.userName})    
        {:noreply, socket}
    end

end