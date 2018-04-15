defmodule Websocket.RoomManager do
    use Agent, export: __MODULE__
    require Logger

    defmodule Room do
        defstruct(
            roomId: "",
            roomPid: nil,
            users: []
        )
    end

    def start_link() do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        room manager init"
        Agent.start_link(fn -> %{} end, name: __MODULE__)
    end

    def create_room(%{roomId: roomId}=params) do
        if (room_exist? params) do
            {:error, "room exist"}
        else
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            create_room #{inspect roomId}"
            {Agent.update(__MODULE__, fn state -> 
                {:ok, roomPid} = Websocket.ServerRoom.new_room(roomId)
                state |> Map.put(roomId, %Room{roomId: roomId, roomPid: roomPid})
            end)}
        end
    end

    def add_user(%{roomId: roomId, pid: pid}) do
        Agent.update(__MODULE__, fn state ->
            room = state |> Map.get(roomId)
            room = %{room | users: [pid | room.users]}
            Map.put(state, roomId, room)
        end)
    end

    def get_room(%{roomId: roomId}) do
        Agent.get(__MODULE__, fn state ->
            state |> Map.get(roomId)
        end)
    end

    def get_room_pid(roomId) do
        case Agent.get(__MODULE__, fn state ->
            state |> Map.get(roomId)
        end) do
            nil ->
                Logger.error "file: #{inspect Path.basename(__ENV__.file)}  line: #{__ENV__.line}
                #{inspect roomId} error state"
                nil
            room ->
                room.roomPid
        end
    end

    def delete_room(%{roomId: roomId}=params) do
        Agent.update(__MODULE__, fn state -> state |> Map.delete roomId end)
    end

    def room_exist?(%{roomId: roomId}) do
        Agent.get(__MODULE__, fn state -> state |> Map.has_key? roomId end)
    end

end