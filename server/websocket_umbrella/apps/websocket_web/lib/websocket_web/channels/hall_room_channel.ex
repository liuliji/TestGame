defmodule WebsocketWeb.HallRoomChannel do
    use Phoenix.Channel
    require Logger
    alias Websocket.UserManager

    def get_user(socket), do: socket.assigns.user

    # `push`, `reply`, and `broadcast` can only be called after the socket has finished joining.
    def join("room:_hall", msg, socket) do
        Logger.debug "#{socket.id} join channel room:_hall"
        Logger.debug "msg:#{inspect msg}"
        send(self(), {:after_join, msg})
        user = %{get_user(socket) | room_id: "_hall"}
        # UserManager.update_user(user)
        {:ok, assign(socket, :user, user)}
    end
    
    def handle_in("ID_C2S_CREATE_ROOM", _msg, socket) do
        Logger.debug "#{inspect socket.id} handle create_room, msg:#{inspect _msg}"
        room_id = UUID.uuid4
        case Websocket.RoomManager.create_room(%{room_id: room_id}) do
            {:ok} ->
                {:reply, {:ok, %{room_id: room_id, owner_id: get_user(socket).uid}}, socket}
            {:error, msg} ->
                {:reply, {:error, %{reason: msg}}}
        end
    end

    def handle_in("ID_C2S_DELETE_ROOM",  %{"room_id" => room_id}=msg, socket) do
        Logger.debug "#{inspect socket.id} hanle delete_room, msg:#{inspect msg}"
        Websocket.RoomManager.delete_room(%{room_id: room_id})
        {:noreply, socket}
    end

    def handle_in("ID_C2S_TALK", %{"content" => content} = msg, socket) do
        Logger.debug "#{inspect socket.id} say #{content}"
        Phoenix.Channel.broadcast!(socket, "ID_S2C_TALK", %{user_id: get_user(socket).uid, content: content})
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
        {:ok, assign(socket, :user, %{get_user(socket) | room_id: ""})}
        :ok
    end

    #----------- handle_info ------------------
    def handle_info({:after_join, _msg}, socket) do
        user = get_user(socket);
        Logger.debug "handle_info socket:#{inspect socket}"
        push(socket, "ID_S2C_JOIN_HALL_TEST", %{msg: "join hall success"})
        Phoenix.Channel.broadcast!(socket, "ID_S2C_JOIN_ROOM", %{uid: user.uid, user_name: user.user_name, room_id: user.room_id})    
        {:noreply, socket}
    end

end