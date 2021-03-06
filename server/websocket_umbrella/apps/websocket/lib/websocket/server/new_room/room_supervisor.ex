defmodule Websocket.RoomSupervisor do

    # go home and change to DynamicSupervisor
    use DynamicSupervisor
    alias Websocket.ServerRoom, as: ServerRoom
    alias Websocket.RoomSupervisor
    require Logger

    def start_link do
        ret = DynamicSupervisor.start_link(__MODULE__, :ok, [name: __MODULE__])
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        #{inspect __MODULE__} start #{inspect ret}"
        ret
    end

    @imp true
    def init(:ok) do

        DynamicSupervisor.init([
            strategy: :one_for_one,
            max_restarts: 3,
            max_seconds: 5,
            max_children: :infinity, # :infinity is default value
        ])
    end

    def new_room(roomId) do
        c_spec = %{
            id: roomId,
            start: {ServerRoom, :start_link, [roomId]},
            restart: :transient, # 非:normal, :shutdown, {:shutdown, term} 重启
            type: :worker
        }
        DynamicSupervisor.start_child(__MODULE__, c_spec)
        Process.sleep(100)
        # pid
    end

    def find_room(roomId) do
        case Registry.lookup(Websocket.Application.room_registry_name, roomId) do
            [] -> {:error, "room not exist"}
            [{_, pid}] -> pid
        end
    end

    def del_room(roomId) do
        DynamicSupervisor.terminate_child(__MODULE__, find_room(roomId))
    end

end