defmodule Websocket.ServerUser.MainBehaviour do
    use Entice.Entity.Behaviour
    alias Entice.Entity
    alias Websocket.ServerUser2.User
    alias Websocket.ServerUser2, as: ServerUser
    require Logger


    def init(entity, args) do
        entity = put_attribute(entity, args)
        Process.monitor(args.socketPid)
        {:ok, entity}
    end

    def terminate(reason,
    %Entity{attributes: %{User => user}} = entity) do
        # send(get_room_pid(user.roomId), {:leaveRoom, user.uid})
        Logger.info "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
        user server exit reason:#{inspect reason} \nuser:#{inspect get_attribute(entity, User)}"
        {:ok, entity}
    end

    def handle_event({:DOWN, _, _, _, reason} = msg, entity) do
        Logger.info "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        user client disconnected #{inspect msg}. entity: #{inspect entity}"
        {:stop_process, {:shutdown, "user client disconnected"}, entity}
    end

    
    def handle_event(msg,
    %Entity{attributes: %{User => user}} = entity) do
        {:ok, entity}
    end
end