defmodule WebsocketWeb.HallRoomChannel do
    use Phoenix.Channel
    require Logger

    def get_user(socket), do: socket.assign.user

    def join("room:_hall", msg, socket) do
        Logger.debug "#{socket.id} join channel room:_hall"
        Logger.debug "msg:#{inspect msg}"
        {:ok, assign(socket, :user, %{get_user(socket) | room_id: "_hall"})}
    end

    def handle_in("ID_C2S_CREATE_ROOM", _msg, socket) do
        Logger.debug "#{inspect socket.} hanle create_room, msg:#{inspect _msg}"
        case Websocket.RoomManager.create_room(%{room_id: room_id}) do
            {:ok} ->
                {:ok, socket}
            {:error, msg} ->
                {:error, %{reason: msg}}
        end
    end

    def handle_in("ID_C2S_DELETE_ROOM",  %{"room_id" => room_id}=msg, socket) do
        Logger.debug "#{inspect socket.id} hanle delete_room, msg:#{inspect msg}"
        Websocket.RoomManager.delete_room(%{room_id: room_id})
    end

    def handle_in("ID_C2S_TALK", %{"content" => content} = msg, socket) do
        Logger.debug "#{inspect socket.id} say #{content}"
        Phoenix.Channel.broadcast!(socket, "ID_S2C_TALK", %{user_id: socket.id, content: content})
    end

    intercept ["ID_S2C_TALK"]
    def handle_out("ID_S2C_TALK", msg, socket) do
        Logger.debug "#{inspect socket.id} handle out talk topic, msg:#{inspect msg}"
        Phoenix.Channel.push socket, "ID_S2C_TALK", msg
        {:reply, :ok, socket}
    end

    def terminate(reason, socket) do
        Logger.error "#{__MODULE__} termiatelive socket:#{inspect socket.id}. reason:#{inspect reason}"
        :ok
    end

end