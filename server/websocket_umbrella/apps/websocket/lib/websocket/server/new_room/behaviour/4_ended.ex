defmodule Websocket.ServerRoom.EndedBehaviour do
    alias Websocket.ServerRoom2, as: ServerRoom
    alias Websocket.ServerRoom2.Room
    require Logger

    use Entice.Entity.Behaviour
    alias Entice.Entity

    def init(entity, :ok) do
        {:ok, entity}
    end

    def handle_event(msg,
    %Entity{attributes: %{Room => room}} = entity) do
        {:become, Websocket.ServerRoom.UnreadyedBehaviour, :ok, entity}
    end
end