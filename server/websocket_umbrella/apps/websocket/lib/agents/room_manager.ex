defmodule Websocket.RoomManager do
    use Agent, export: __MODULE__
    require Logger
    alias  

    defmodule Room do
        defstruct(
            id: "",
            owner_id: "",
            user
        )
    end

    def start_link() do
        Logger.debug "#{__MODULE__} started."
        Agent.start_link(fn -> MapSet.new end, name: __MODULE__)
    end

    def create_room(%{room_id: room_id}=params) do
        if (room_exist? params) do
            {:error, "room exist"}
        else
            {Agent.update(__MODULE__, fn state -> 
                state |> MapSet.put room_id
            end)}
        end
    end

    def delete_room(%{room_id: room_id}=params) do
        Agent.update(__MODULE__, fn state -> state |> MapSet.delete room_id end)
    end

    def room_exist?(%{room_id: room_id}) do
        Agent.get(__MODULE__, fn state -> state |> MapSet.member? room_id end)
    end

end