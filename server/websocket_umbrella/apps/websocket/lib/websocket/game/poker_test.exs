defmodule PokerTest do
    
    def test_poker() do
        size = 1..10

        cards = Websocket.Poker.init_all_poker()
        {poker_list, cards} = Enum.reduce(size, {[], cards}, fn _, {result, l} ->
            {p, l} = Websocket.Poker.random_poker(l)
            IO.puts Websocket.Poker.poker_string(p)
            {[p | result], l}
        end)

        max_poker = Enum.reduce(poker_list, poker_list |> List.first, fn item, max ->
            if Websocket.Poker.compare_pokers?(item, max) do
                max
            else
                item
            end
        end)

        IO.puts "\n最大值：" <> Websocket.Poker.poker_string(max_poker)
    end

    def test_adapter() do
        cards = Websocket.Poker.init_all_poker()
        {poker, cards} = Websocket.Poker.random_poker(cards)
        single_poker = poker.pokers |> List.first
        IO.puts single_poker
        IO.puts Websocket.PokerAdapter.to_client(single_poker)
        IO.puts(inspect poker)
        IO.puts(Websocket.Poker.poker_string(poker))
        IO.puts(inspect Websocket.PokerAdapter.to_client(poker))
    end
end