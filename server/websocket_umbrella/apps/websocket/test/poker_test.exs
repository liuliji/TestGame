defmodule PokerTest do
    use ExUnit.Case

    test "10pokers and get max one" do
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

        IO.puts "\n最大值：" <> Websocket.Poker.poker_string(p)

    end
end