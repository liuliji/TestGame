defmodule WebsocketWeb.RoomsChannel_In do
    defmacro __using__(_) do
        quote do
            
            def handle_in("ID_C2S_LEAVE_ROOM", _msg, socket) do
                send(get_user_pid(socket), :leaveRoom)
                {:noreply, socket}
            end
        
            def handle_in("ID_C2S_DISSOLVE_ROOM", _msg, socket) do
                send(get_user_pid(socket), :dissolveRoom)
                {:noreply, socket}
            end
        
            def handle_in("ID_C2S_READY", _msg, socket) do
                send(get_user_pid(socket), :ready)
                {:noreply, socket}
            end
        
            def handle_in("ID_C2S_CANCEL_READY", _msg, socket) do
                # 暂时关闭取消功能
                # send(get_user_pid(socket), :cancelReady)
                {:noreply, socket}
            end

            def handle_in("ID_C2S_START_GAME", _msg, socket) do
                send(get_user_pid(socket), :startGame)
                {:noreply, socket}
            end

        end
    end
end