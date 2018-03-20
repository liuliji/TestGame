defmodule WebsocketWeb.HallRoomChannel do
    use Phoenix.Channel
    require Logger
    alias Websocket.UserManager

    def get_user(socket), do: socket.assigns.user

    # `push`, `reply`, and `broadcast` can only be called after the socket has finished joining.
    def join("lobby", msg, socket) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        #{socket.id} join channel lobby msg:#{inspect msg}"
        send(self(), {:afterJoin, msg})
        user = %{get_user(socket) | roomId: "lobby"}
        # UserManager.update_user(user)
        {:ok, assign(socket, :user, user)}
    end
    
    def handle_in("ID_C2S_CREATE_ROOM", _msg, socket) do
        roomId = UUID.uuid4
        case Websocket.RoomManager.create_room(%{roomId: roomId}) do
            {:ok} ->
                Phoenix.Channel.push(socket, "ID_S2C_CREATE_ROOM_SUCCESS", %{roomId: roomId, ownerId: get_user(socket).uid})
                {:noreply, socket}
            {:error, msg} ->
                Phoenix.Channel.push(socket, "ID_S2C_CREATE_ROOM_FAIL", %{code: -1, reason: msg})
                {:noreply, socket}
        end
    end

    def handle_in("ID_C2S_DELETE_ROOM",  %{"roomId" => roomId}=msg, socket) do
        Websocket.RoomManager.delete_room(%{roomId: roomId})
        {:noreply, socket}
    end

    def handle_in("ID_C2S_TALK", %{"content" => content} = msg, socket) do
        Logger.debug "#{inspect socket.id} say #{content}"
        Phoenix.Channel.broadcast!(socket, "ID_S2C_TALK", %{userId: get_user(socket).uid, content: content})
        {:noreply, socket}
    end

    intercept ["ID_S2C_TALK", "ID_S2C_JOIN_ROOM"]
    # handle_out can't reply
    # replies can only be sent from a `handle_in/3` callback
    def handle_out("ID_S2C_TALK", msg, socket) do
        Logger.debug "#{inspect socket.id} handle out talk topic, msg:#{inspect msg}"
        Phoenix.Channel.push socket, "ID_S2C_TALK", msg
        {:noreply, socket}
    end

    def handle_out("ID_S2C_JOIN_ROOM", msg, socket) do
        Logger.debug "#{inspect socket.id} handle out join topic, msg:#{inspect msg}"
        Phoenix.Channel.push socket, "ID_S2C_JOIN_ROOM", msg
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
        Logger.debug "handle_info socket:#{inspect socket}"
        Phoenix.Channel.broadcast!(socket, "ID_S2C_JOIN_ROOM", %{uid: user.uid, userName: user.userName, roomId: user.roomId})    
        {:noreply, socket}
    end

end