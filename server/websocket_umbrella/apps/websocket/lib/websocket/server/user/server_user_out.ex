defmodule Websocket.ServerUser_Out do
    
    require Logger
    alias Websocket.ServerUser.User
    alias Entice.Entity
    alias Websocket.Poker

    defmacro __using__(_) do
        quote do
            # 自己受到的joined 消息
            def handle_event({:joined, uid},
            %Entity{attributes: %{User => %{uid: uid} = user}} = entity) do
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                自己受到自己 joined的消息 #{uid} entity:#{inspect entity}"
                {:ok, entity}
            end

            def handle_event({:joined, newUid},
            %Entity{attributes: %{User => user}} = entity) do
                user = get_attribute(entity, User)
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                收到别人加入房间的消息 #{newUid}. entity:#{inspect entity}"
                send(user.channelPid, {:joined, newUid})
                {:ok, entity}
            end

            def handle_event({:joinSuccess, {roomId, pos, roomOwner}} = msg,
            %Entity{attributes: %{User => user}} = entity) do
                Logger.info "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                joinSuccess roomId:#{inspect roomId}, user:#{inspect user}"
                entity = entity |> update_user(:roomId, roomId) |> update_user(:position, pos) |> update_user(:roomOwner, roomOwner)
                # roomPid
                send(user.channelPid, msg)
                {:ok, entity}
            end
                
            def handle_event(:leavedRoom,
            %Entity{attributes: %{User => user}} = entity) do
                channelPid = user.channelPid
                entity = clear_room_info_(entity)
                send(channelPid, :leavedRoom)
                {:ok, entity}
            end

            def handle_event(:dissolvedRoom,
            %Entity{attributes: %{User => user}} = entity) do
                channelPid = user.channelPid
                entity = clear_room_info_(entity)
                send(channelPid, :leavedRoom)
                {:ok, entity}
            end

            def handle_event({:readyed, uid},
            %Entity{attributes: %{User => user}} = entity) do
                send(user.channelPid, {:readyed, uid})
                {:ok, entity}
            end
        
            def handle_event({:canceledReady, uid},
            %Entity{attributes: %{User => user}} = entity) do
                send(user.channelPid, :canceledReady)
                {:ok, entity}
            end

            def handle_event({:fapai, %Poker{} = poker},
            %Entity{attributes: %{User => user}} = entity) do
                user = %{user | poker: poker}
                send(user.channelPid, :fapai)
                {:ok, entity |> put_attribute(user)}
            end

            #------------

            defp clear_room_info_(entity) do
                entity |> update_user(:channelPid, nil)
                |> update_user(:roomPid, nil)
                |> update_user(:roomId, "")
                |> update_user(:position, -1)
                |> update_user(:readyStatus, false)
                |> update_user(:roomOwner, false)
            end
        end
    end
end