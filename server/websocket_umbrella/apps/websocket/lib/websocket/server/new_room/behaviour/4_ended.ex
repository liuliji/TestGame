defmodule Websocket.ServerRoom.EndedBehaviour do
    alias Websocket.ServerRoom, as: ServerRoom
    alias Websocket.ServerRoom.Room
    require Logger

    use Entice.Entity.Behaviour
    alias Entice.Entity

    # 赢家的位置 和 房间的总筹码
    def init(entity, {:ok, {winner_position, chips}}) do
        send(self(), {:end_turns, {winner_position, chips}})
        {:ok, entity}
    end

    def handle_event({:end_turns, {winner_position, chips}},
    %Entity{attributes: %{Room => room}} = entity) do
        send(self(), {:notify_all, {:kaipai, {winner_position, chips}}})
        {:become, Websocket.ServerRoom.UnreadyedBehaviour, :ok, entity}
    end
end