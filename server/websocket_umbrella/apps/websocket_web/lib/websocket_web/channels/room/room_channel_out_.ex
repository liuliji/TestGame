defmodule WebsocketWeb.RoomsChannel_Out do

    alias Phoenix.Socket

    defmacro __using__(_) do
        quote do

            defp actions() do
                [
                    %{
                        "aId": 1,
                        "aText": "看牌"
                    },
                    %{
                        "aId": 2,
                        "aText": "押注"
                    },
                    %{
                        "aId": 3,
                        "aText": "弃牌"
                    },
                    %{
                        "aId": 4,
                        "aText": "开牌"
                    }
                ]
            end

            defp get_actions(tar_pos, self_pos, true) when tar_pos == self_pos do
                actions()
            end

            defp get_actions(tar_pos, self_pos, false) when tar_pos == self_pos do
                actions()
                |> Enum.filter(fn item_map -> Map.get(item_map, :aId) != 4 end)
            end

            # 当不是自己说话的时候 只能看牌
            defp get_actions(_, _, _) do
                actions()
                |> Enum.filter(fn item_map -> Map.get(item_map, :aId) == 1 end)
            end
            
            def handle_info({:joined, newUid}, socket) do
                newUser = Websocket.ServerUser.user_info(Websocket.UserSupervisor.find_user(newUid))
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
                user = Websocket.UserSupervisor.find_user(get_user_uid(socket))
                Logger.info "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                user left room #{inspect roomId}
                userInfo:#{inspect user}"
                # {:stop, {:shutdown, "user_left"}, socket}
                {:noreply, socket}
            end

            def handle_info({:othersLeavedRoom, pos}, socket) do
                Phoenix.Channel.push(socket, "ID_S2C_OTHERS_LEAVE_ROOM", %{position: pos})
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
                ret_poker = %{poker: default_poker |> poker_to_client}
                
                Phoenix.Channel.push(socket, "ID_S2C_FAPAI", ret_poker)
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                ID_S2C_FAPAI:#{inspect ret_poker}"
                
                {:noreply, socket}
            end

            def handle_info({:next_talk, pos}, socket) do
                uinfo = socket |> get_user_pid |> Websocket.ServerUser.user_info
                room_info = socket |> get_user_roomPid |> Websocket.ServerRoom.room_info 

                ret_actions = %{
                    actions: get_actions(pos, uinfo.position, room_info.isActions),
                    actionPositions: Enum.at(room_info.playingIndexList, room_info.currIndex)
                }

                Phoenix.Channel.push(socket, "ID_S2C_ACTION_INFO", ret_actions)
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                ID_S2C_ACTION_INFO:#{inspect ret_actions}"

                {:noreply, socket}
            end

            def handle_info({:self_kanpai, %Websocket.Poker{} = poker}, socket) do
                ret_poker = %{poker: poker |> poker_to_client}
                
                Phoenix.Channel.push(socket, "ID_S2C_KANPAI", ret_poker)
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                ID_S2C_KANPAI:#{inspect ret_poker}"
                
                {:noreply, socket}
            end

            def handle_info({:other_kanpai, tar_user_pos}, socket) do
                Phoenix.Channel.push(socket, "ID_S2C_OTHERS_KANPAI", %{pos: tar_user_pos})
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                ID_S2C_OTHERS_KANPAI:#{inspect tar_user_pos}"
                {:noreply, socket}
            end

            def handle_info({:self_yazhu_failed, msg}, socket) do
                Phoenix.Channel.push(socket, "ID_S2C_YAZHU_FAILED", %{msg: msg})
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                ID_S2C_YAZHU_FAILED:#{inspect msg}"
                {:noreply, socket}
            end

            def handle_info({:self_yazhu, count}, socket) do
                Phoenix.Channel.push(socket, "ID_S2C_YAZHU", %{count: count})
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                ID_S2C_YAZHU:#{inspect count}"
                {:noreply, socket}
            end

            def handle_info({:other_yazhu, tar_user_pos, count}, socket) do
                Phoenix.Channel.push(socket, "ID_S2C_OTHERS_YAZHU", %{count: count, pos: tar_user_pos})
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                ID_S2C_OTHERS_YAZHU: count:#{inspect count}, pos:#{tar_user_pos}"
                {:noreply, socket}
            end

            def handle_info(:self_qipai, socket) do
                Phoenix.Channel.push(socket, "ID_S2C_QIPAI", %{})
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                ID_S2C_QIPAI"
                {:noreply, socket}
            end

            def handle_info({:other_qipai, tar_user_pos}, socket) do
                Phoenix.Channel.push(socket, "ID_S2C_OTHERS_QIPAI", %{pos: tar_user_pos})
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                ID_S2C_OTHERS_QIPAI: pos:#{tar_user_pos}"
                {:noreply, socket}
            end

            def handle_info(:kaipai, socket) do
                bd_game_result(socket)
                {:noreply, socket}
            end

            defp bd_game_result(socket) do
                userList =
                Websocket.ServerRoom.users(get_user_roomPid(socket))
                |> Enum.map(fn
                    user_item -> 
                        user_item
                        |> get_client_user
                        |> Map.put(:deltaMoney, user_item.curMoney - user_item.originMoney)
                        |> Map.delete(:originMoney)
                        |> Map.put(:poker, user_item.poker |> Websocket.PokerAdapter.to_client)
                end)
                
                result = %{
                    users: userList
                }

                Logger.info "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
                ID_S2C_GAME_RESULT: #{inspect result}"

                Phoenix.Channel.push(socket, "ID_S2C_GAME_RESULT", result)
            end

            

            defp bd_room_info(socket) do
                userList = Websocket.ServerRoom.users(get_user_roomPid(socket))
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

            defp default_poker() do
                %Websocket.Poker{
                    pokers: [0, 0, 0],
                    type: 0,
                    extra: nil
                }
            end
            
        end
    end
end