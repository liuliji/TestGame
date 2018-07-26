defmodule WebsocketWeb.RoomsChannel_Out do

    alias Phoenix.Socket

    defmacro __using__(_) do
        quote do
            
            def handle_info({:joined, newUid}, socket) do
                newUser = Websocket.ServerUser.user_info(Websocket.UserManager.get_user_pid(newUid))
                Logger.info "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                newUser joined newUser:#{inspect newUser}"
                Phoenix.Channel.push(socket, "ID_S2C_JOIN_ROOM", get_client_user(newUser))
                {:noreply, socket}
            end
        
            def handle_info({:joinSuccess, {roomId, _pos, _roomOwner} = msg}, socket) do
                socket = socket |> Socket.assign(:roomId, roomId)
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                joinSuccess  #{inspect msg}"
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
        
            def handle_info({:readyed, position}, socket) do
                Phoenix.Channel.push(socket, "ID_S2C_READY", %{position: position})
                {:noreply, socket}
            end
        
            def handle_info({:canceledReady, uid}, socket) do
                Phoenix.Channel.push(socket, "ID_S2C_CANCEL_READY", %{uid: uid})
                {:noreply, socket}
            end

            def handle_info(:fapai, socket) do
                uinfo = socket |> get_user_pid |> Websocket.ServerUser.user_info
                Phoenix.Channel.push(socket, "ID_S2C_FAPAI", %{poker: uinfo.poker |> poker_to_client})
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                pokerInfo:#{inspect uinfo.poker}"
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

            defp poker_to_client(%Websocket.Poker{} = poker) do
                Websocket.PokerAdapter.to_client(poker)
            end
            
        end
    end
end