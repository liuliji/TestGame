defmodule Websocket.RoomSupervisor do

    # go home and change to DynamicSupervisor
    use Supervisor
    alias Websocket.ServerRoom2, as: ServerRoom
    alias Websocket.RoomSupervisor

    def start_link do
        Supervisor.start_link(__MODULE__, :ok, [name: __MODULE__])
    end

    @imp true
    def init(:ok) do

        Supervisor.init([], [
            strategy: :one_for_one,
            max_restarts: 3,
            max_seconds: 5
        ])
    end

    def new_room(roomId) do
        c_spec = %{
            id: roomId,
            start: {ServerRoom, start_link, [roomId]},
            restart: :transient, # 非:normal, :shutdown, {:shutdown, term} 重启
            type: :worker
        }
        Supervisor.start_child(__MODULE__, c_spec)
    end

    def find_room(roomId) do
        case Registry.lookup(Websocket.Application.room_registry_name, roomId) do
            [] -> {:error, "room not exist"}
            [{pid, _}] -> {:ok, pid}
        end
    end

end