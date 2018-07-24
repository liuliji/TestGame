defmodule Websocket.ServerUser_In do

    require Logger
    alias Websocket.ServerUser.User
    alias Entice.Entity

    defmacro __using__(_) do
        quote do
            def handle_event({:joinLobby, channelPid}, entity) do
                {:ok, entity |> update_user(:roomId, WebsocketWeb.HallRoomChannel.get_lobby_name()) |> update_user(:channelPid, channelPid)}
            end
    
            def handle_event({:join, roomId, channelPid}, entity) do
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                receive msg join #{inspect roomId} "
                user = entity |> get_attribute(User)
                entity = put_attribute(entity, %{user | channelPid: channelPid})
                send(get_room_pid(roomId), {:join, user})
                {:ok, entity}
            end

            
            def handle_event(:leaveRoom,
            %Entity{attributes: %{User => user}} = entity) do
                send(get_room_pid(user.roomId), {:leaveRoom, user.uid})
                {:ok, entity}
            end

            def handle_event(:dissolveRoom,
            %Entity{attributes: %{User => user}} = entity) do
                send(get_room_pid(user.roomId), {:dissolveRoom, user.uid})
                {:ok, entity}
            end

            
            def handle_event(:ready,
            %Entity{attributes: %{User => user}} = entity) do
                entity = update_user(entity, :readyStatus, true)
                send(get_room_pid(user.roomId), {:ready, user.uid})
                {:ok, entity}
            end

            def handle_event(:cancelReady,
            %Entity{attributes: %{User => user}} = entity) do
                entity = update_user(entity, :readyStatus, false)
                send(get_room_pid(user.roomId), {:cancelReady, user.uid})
                {:ok, entity}
            end

            def handle_event(:startGame,
            %Entity{attributes: %{User => user}} = entity) do
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                startGame userOwner?:#{inspect user.roomOwner}"
                # if user.roomOwner do
                    send(get_room_pid(user.roomId), :startGame)                    
                # end

                {:ok, entity}
            end

        end
    end
end