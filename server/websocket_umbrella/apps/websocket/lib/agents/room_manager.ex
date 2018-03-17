defmodule Websocket.RoomManager do
    use Agent, export: __MODULE__
    require Logger

    defmodule Room do
        defstruct(
            room_id: "",
            users: []
        )
    end

    def start_link() do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        room manager init"
        Agent.start_link(fn -> %{} end, name: __MODULE__)
    end

    def create_room(%{room_id: room_id}=params) do
        if (room_exist? params) do
            {:error, "room exist"}
        else
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            create_room #{inspect room_id}"
            {Agent.update(__MODULE__, fn state -> 
                state |> Map.put(room_id, %Room{room_id: room_id})
            end)}
        end
    end

    def delete_room(%{room_id: room_id}=params) do
        Agent.update(__MODULE__, fn state -> state |> Map.delete room_id end)
    end

    def room_exist?(%{room_id: room_id}) do
        Agent.get(__MODULE__, fn state -> state |> Map.has_key? room_id end)
    end

end