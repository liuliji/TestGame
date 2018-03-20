defmodule Websocket.RoomManager do
    use Agent, export: __MODULE__
    require Logger

    defmodule Room do
        defstruct(
            roomId: "",
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
                state |> Map.put(roomId, %Room{roomId: roomId})
            end)}
        end
    end

    def delete_room(%{roomId: roomId}=params) do
        Agent.update(__MODULE__, fn state -> state |> Map.delete roomId end)
    end

    def room_exist?(%{roomId: roomId}) do
        Agent.get(__MODULE__, fn state -> state |> Map.has_key? roomId end)
    end

end