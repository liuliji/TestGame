defmodule Websocket.ServerUser.InRoomBehaviour do
    use Entice.Entity.Behaviour
    alias Entice.Entity
    alias Websocket.ServerUser2.User
    alias Websocket.ServerUser2, as: ServerUser
    require Logger

    def init(entity, args) do
        {:ok, entity}
    end

    def handle_event(msg,
    %Entity{attributes: %{User => user}} = entity) do
        {:ok, entity}
    end

end