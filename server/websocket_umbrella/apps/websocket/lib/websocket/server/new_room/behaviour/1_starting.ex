defmodule Websocket.ServerRoom.StartingBehaviour do
    alias Websocket.ServerRoom2, as: ServerRoom
    alias Websocket.ServerRoom2.Room
    require Logger

    use Entice.Entity.Behaviour
    alias Entice.Entity

    def init(entity, :ok) do
        send(self, :starting_start_game)
        {:ok, entity}
    end

    def handle_event(:starting_start_game,
    %Entity{attributes: %{Room => room}} = entity) do
        all_poker = Poker.init_all_poker()
        Enum.reduce(room.users, all_poker, fn
            {pos, %{pid: pid}}, all_poker ->
                {poker, all_poker} = Poker.random_poker(all_poker)
                send(pid, {:fapai, poker})
                all_poker
            _, all_poker -> all_poker
        end)

        playingIndexList = Enum.reduce(room.users, room.playingIndexList, fn
            {pos, %{pid: pid}}, list ->
                [pos | list]
            _, list -> list
        end)

        room = %{room | playingIndexList: :lists.sort(playingIndexList)}
        
        {:become, Websocket.ServerRoom.PlayingBehaviour, :ok, entity |> put_attribute(room)}
    end
end