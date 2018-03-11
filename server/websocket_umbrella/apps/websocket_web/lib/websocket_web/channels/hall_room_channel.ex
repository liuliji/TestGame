defmodule WebsocketWeb.HallRoomChannel do
    use Phoenix.Channel
    require Logger

    def join("room:_hall", msg, socket) do
        Logger.debug "#{socket.id} join channel room:_hall"
        Logger.debug "msg:#{inspect msg}"
        {:ok, socket}
    end

    def handle_in("create_room", %{"room_id" => room_id}=msg, socket) do
        Logger.debug "#{inspect socket.id} hanle create_room, msg:#{inspect msg}"
        case Websocket.RoomManager.create_room(%{room_id: room_id}) do
            {:ok} ->
                {:ok, socket}
            {:error, msg} ->
                {:error, %{reason: msg}}
        end
    end

    def handle_in("delete_room",  %{"room_id" => room_id}=msg, socket) do
        Logger.debug "#{inspect socket.id} hanle delete_room, msg:#{inspect msg}"
        Websocket.RoomManager.delete_room(%{room_id: room_id})
    end

    def handle_in("bc:talk", %{"content" => content} = msg, socket) do
        Logger.debug "#{inspect socket.id} say #{content}"
        Phoenix.Channel.broadcast!(socket, "talk", %{user_id: socket.id, content: content})
    end

    intercept ["talk"]
    def handle_out("talk", msg, socket) do
        Logger.debug "#{inspect socket.id} handle out talk topic, msg:#{inspect msg}"
        Phoenix.Channel.push socket, "talk", msg
        {:reply, :ok, socket}
    end

    def terminate(reason, socket) do
        Logger.error "#{__MODULE__} termiatelive socket:#{inspect socket.id}. reason:#{inspect reason}"
        :ok
    end

end