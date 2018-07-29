defmodule Websocket.PokerAdapter do

    def to_client(0) do
        0
    end

    def to_client(<<?M, pc>>) do
        1+(pc-?1)*13
    end

    def to_client(<<ps, pc>>) do
        ps+1+1-?A+(pc-?1)*13
    end

    def to_client(pokers) when is_list(pokers) do
        pokers |> Enum.map(&to_client(&1))
    end

    def to_client(%Websocket.Poker{}=poker) do
        poker
        |> Map.from_struct
        |> Enum.reduce(%{}, fn
            {:type, value} = item, acc -> acc |> Map.put_new(:type, value)
            {:extra, value} = item, acc -> acc |> Map.put_new(:extra, value)
            {:pokers, pokers}, acc -> acc |> Map.put_new(:pokers, to_client(pokers))
        end)
    end

end