defmodule WebsocketWeb.RoomsChannel_Out do

    alias Phoenix.Socket

    defmacro __using__(_) do
        quote do
            
            def handle_info({:joined, newPid}, socket) do
                newUser = Websocket.ServerUser.user_info(newPid)
                Phoenix.Channel.push(socket, "ID_S2C_JOIN_ROOM", get_client_user(newUser))
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                newUser joined newUser:#{inspect newUser}"
                {:noreply, socket}
            end
        
            def handle_info({:joinSuccess, {roomId, _pos, _roomOwner}}, socket) do
                socket = socket |> Socket.assign(:roomId, roomId)
                bd_room_info(socket)
                {:noreply, socket}
            end
        
            def handle_info(:leavedRoom, socket) do
                roomId = get_user_roomId(socket)
                socket = socket |> Socket.assign(:roomId, roomId)
                Phoenix.Channel.push(socket, "ID_S2C_LEAVE_ROOM_SUCCESS", %{roomId: roomId})
                {:noreply, socket}
            end
        
            def handle_info(:user_changed, socket) do
                bd_room_info(socket)
                {:noreply, socket}
            end
        
            def handle_info({:readyed, uid}, socket) do
                Phoenix.Channel.push(socket, "ID_S2C_READY", %{uid: uid})
                {:noreply, socket}
            end
        
            def handle_info({:canceledReady, uid}, socket) do
                Phoenix.Channel.push(socket, "ID_S2C_CANCEL_READY", %{uid: uid})
                {:noreply, socket}
            end

            defp bd_room_info(socket) do
                userList = Websocket.ServerRoom.get_users(get_user_roomPid(socket))
                    |> Enum.map(fn user_item -> get_client_user(user_item) end)
        
                userSelf = get_client_user(Websocket.ServerUser.user_info(get_user_pid(socket)))
        
                userList = userList |> List.delete(userSelf)
        
                result = %{room: get_client_room(Websocket.ServerRoom.room_info(get_user_roomPid(socket))),
                    userSelf: userSelf,
                    users: userList
                }
                Phoenix.Channel.push(socket, "ID_S2C_ROOM_INFO", result)
            end
            
        end
    end
end