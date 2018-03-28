defmodule WebsocketWeb.HallRoomChannel do
    use Phoenix.Channel
    require Logger
    alias Websocket.UserManager

    @room_name "lobby"

    def get_user(socket), do: WebSocket.UserEntity.get_info(socket.assigns.pid)
    def update_user(socket, map), do: Websocket.UserEntity.update_info(socket.assigns.pid, map)

    # `push`, `reply`, and `broadcast` can only be called after the socket has finished joining.
    def join(@room_name = room_name, msg, socket) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        #{socket.id} join channel #{room_name} msg:#{inspect msg}"
        send(self(), {:afterJoin, msg})

        update_user(socket, %{roomId: room_name})
        {:ok, socket}
    end
    
    def handle_in("ID_C2S_CREATE_ROOM", _msg, socket) do
        roomId = UUID.uuid4
        case Websocket.RoomManager.create_room(%{roomId: roomId}) do
            {:ok} ->
                Phoenix.Channel.push(socket, "ID_S2C_CREATE_ROOM_INFO", %{roomId: roomId})
                {:noreply, socket}
            {:error, msg} ->
                Phoenix.Channel.push(socket, "ID_S2C_CREATE_ROOM_FAILED", %{code: -1, reason: msg})
                {:noreply, socket}
        end
    end

    def handle_in("ID_C2S_DELETE_ROOM",  %{"roomId" => roomId}=msg, socket) do
        Websocket.RoomManager.delete_room(%{roomId: roomId})
        {:noreply, socket}
    end

    def handle_in("ID_C2S_LOBBY_TALK", %{"content" => content} = msg, socket) do
        Logger.debug "#{inspect socket.id} say #{content}"
        Phoenix.Channel.broadcast!(socket, "ID_S2C_LOBBY_TALK", %{userId: get_user(socket).uid, content: content})
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
        Logger.debug "#{inspect socket.id} handle out join topic, msg:#{inspect msg}"
        Phoenix.Channel.push socket, "ID_S2C_JOIN_LOBBY_ROOM", msg
        {:noreply, socket}
    end

    def terminate(reason, socket) do
        Logger.error "#{__MODULE__} termiatelive socket:#{inspect socket.id}. reason:#{inspect reason}"
        {:ok, assign(socket, :user, %{get_user(socket) | roomId: ""})}
        :ok
    end

    #----------- handle_info ------------------
    def handle_info({:afterJoin, _msg}, socket) do
        user = get_user(socket);
        Phoenix.Channel.broadcast!(socket, "ID_S2C_JOIN_LOBBY_ROOM", %{uid: user.uid, userName: user.userName, roomId: user.roomId})    
        {:noreply, socket}
    end

end