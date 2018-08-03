defmodule Websocket.Poker do
    alias Websocket.Poker
    require Logger

    # 牌面 2-10-J-A
    # ?A = 65, ?M = 77
    defp poker_size_, do: ?A..?M
    # 黑红梅方
    # ?1 = 49, ?4 = 52
    defp poker_color_, do: ?1..?4

    @baozi 9
    @tonghuashun 7
    @shunzi 5
    @tonghua 4
    @duizi 3
    @danpai 1

    defstruct(
        pokers: [],
        type: @danpai,
        extra: nil      # baozi的话 记录是谁，对子的话，记录是谁
    )

    def init_all_poker() do
        poker_list = for size <- poker_size_,
            color <- poker_color_,
            do: <<size, color>>
    end

    def random_poker(list) do
        {pokers, list} = Enum.reduce(1..3, {[], list}, fn _,{result, l} ->
            {item, l} = l |> List.pop_at(:random.uniform(length(l)-1))
            {[item | result], l}
        end)
        poker = %Poker{pokers: sort_poker_(pokers)}
        poker = poker |> caculate_poker_type_()
        {poker, list}
    end

    def poker_string(%Poker{type: type, pokers: [<<ps1, pc1>> | [<<ps2, pc2>> | [<<ps3, pc3>> | []]]]} = poker) do
        # color_str_list = ["黑", "红", "梅", "方"]
        color_str_list = ["hei_", "hong_", "mei_", "fang_"]
        type_str_list = ["", "单儿", "", "对儿", "同花", "顺子", "", "同花顺", "", "豹子"]

        # Enum.fetch!(type_str_list, type) <> 
        to_string(type) <>
        Enum.fetch!(color_str_list, pc1-?1) <> to_string(ps1-?A+2) <>
        Enum.fetch!(color_str_list, pc2-?1) <> to_string(ps2-?A+2) <>
        Enum.fetch!(color_str_list, pc3-?1) <> to_string(ps3-?A+2)
    end

    @doc """
    true p1 < p2
    false p1 > p2
    """
    def compare_pokers?(%Poker{}=p1, %Poker{}=p2) do
        compare_pokers_(p1, p2)
    end

    defp sort_poker_(list) do
        :lists.sort(fn <<a1, a2>>,<<b1, b2>> ->
            if (a1 == b1) do
                a2 < b2
            else
                a1 < b1 
            end
        end, list)
    end


    ### ------------------ 计算牌的类型 start-------------------------

    defp caculate_poker_type_(%Poker{type: type, pokers: [<<ps1, pc1>> | [<<ps1, pc2>> | [<<ps1, pc3>> | []]]]} = poker) do
        %{poker | type: @baozi, extra: caculate_size(ps1)}
    end

    # 这里的顺子 少了 123
    # error 匹配里面不能使用 + 
    # defp caculate_poker_type_(%Poker{type: type, pokers: [<<ps1, pc1>> | [<<ps1+1, pc2>> | [<<ps1+2, pc3>> | []]]]} = poker) do
    #     if (pc1 == pc2 && pc2 == pc3) do
    #         %{poker | type: @tonghuashun}
    #     else
    #         %{poker | type: @shunzi}
    #     end
    # end

    # 补充 顺子的 123
    defp caculate_poker_type_(%Poker{type: type, pokers: [<<"M", pc1>> | [<<"A", pc2>> | [<<"B", pc3>> | []]]]} = poker) do
        if (pc1 == pc2 && pc2 == pc3) do
            %{poker | type: @tonghuashun}
        else
            %{poker | type: @shunzi}
        end
    end


    defp caculate_poker_type_(%Poker{type: type, pokers: [<<ps1, pc1>> | [<<ps2, pc1>> | [<<ps3, pc1>> | []]]]} = poker) do
        %{poker | type: @tonghua}
    end

    defp caculate_poker_type_(%Poker{type: type, pokers: [<<ps1, pc1>> | [<<ps2, pc2>> | [<<ps3, pc3>> | []]]]} = poker) do
        if (ps2 == ps1+1 && ps3 == ps2+1) do
            if (pc1 == pc2 && pc2 == pc3) do
                %{poker | type: @tonghuashun}
            else
                %{poker | type: @shunzi}
            end
        else if (ps1 == ps2 || ps2 == ps3) do    # 这是排过序的  所以不用比较 ps1 == ps3
            %{poker | type: @duizi, extra: caculate_size(ps2)}
        else
            %{poker | type: @danpai}
        end
        end
    end

    ### ------------------ 计算牌的类型 end-------------------------


    ### ------------------ 比较牌的大小 start-------------------------
    #%Poker{type: type, pokers: [<<ps1, pc1>> | [<<ps2, pc2>> | [<<ps3, pc3>> | []]]]} = poker
    defp compare_pokers_(
        %Poker{type: @baozi, pokers: [_ | [<<ps12, _>> | [_ | []]]]} = poker1,
        %Poker{type: @baozi, pokers: [_ | [<<ps22, _>> | [_ | []]]]} = poker2) do
        # 其实可以发现，如果是baozi或者duizi，那么第二个参数一定是 那个值
        ps12 < ps22
    end

    defp compare_pokers_(
        %Poker{type: @tonghuashun, pokers: [<<_, _>> | [<<ps12, pc12>> | [<<_, _>> | []]]]} = poker1,
        %Poker{type: @tonghuashun, pokers: [<<_, _>> | [<<ps22, pc22>> | [<<_, _>> | []]]]} = poker2) do
        if (ps12 == ps22) do
            pc12 < pc22
        else
            if(ps12 == ?A) do # 123 < QKA
                ps22 == ?M
            else if(ps22 == ?A) do
                ps12 == ?M
            else
                ps12 < ps22
            end
            end
        end
    end

    defp compare_pokers_(
        %Poker{type: @shunzi, pokers: [<<_, _>> | [<<ps12, pc12>> | [<<_, _>> | []]]]} = poker1,
        %Poker{type: @shunzi, pokers: [<<_, _>> | [<<ps22, pc22>> | [<<_, _>> | []]]]} = poker2) do
        if (ps12 == ps22) do
            pc12 < pc22
        else
            if(ps12 == ?A) do # 123 < QKA
                ps22 == ?M
            else if(ps22 == ?A) do
                ps12 == ?M
            else
                ps12 < ps22
            end
            end
        end
    end

    defp compare_pokers_(
        %Poker{type: @tonghua, pokers: [<<ps11, _>> | [<<ps12, pc12>> | [<<ps13, _>> | []]]]} = poker1,
        %Poker{type: @tonghua, pokers: [<<ps21, _>> | [<<ps22, pc22>> | [<<ps23, _>> | []]]]} = poker2) do
        
        if(ps13 != ps23) do
            ps13 < ps23
        else if(ps12 != ps22) do
            ps12 < ps22
        else if(ps11 != ps21) do
            ps11 < ps21
        else
            pc12 < pc22
        end
        end
        end

    end

    defp compare_pokers_(
        %Poker{type: @duizi, pokers: [<<_, _>> | [<<ps12, pc12>> | [<<_, _>> | []]]]} = poker1,
        %Poker{type: @duizi, pokers: [<<_, _>> | [<<ps22, pc22>> | [<<_, _>> | []]]]} = poker2) do
        
        if (ps12 == ps22) do
            pc12 < pc22
        else
            ps12 < ps22
        end

    end

    defp compare_pokers_(
        %Poker{type: @danpai, pokers: [<<ps11, _>> | [<<ps12, _>> | [<<ps13, pc13>> | []]]]} = poker1,
        %Poker{type: @danpai, pokers: [<<ps21, _>> | [<<ps22, _>> | [<<ps23, pc23>> | []]]]} = poker2) do
        
            if(ps13 != ps23) do
                ps13 < ps23
            else if(ps12 != ps22) do
                ps12 < ps22
            else if(ps11 != ps21) do
                ps11 < ps21
            else
                pc13 < pc23
            end
            end
            end

    end

    defp compare_pokers_(
        %Poker{type: type1} = poker1,
        %Poker{type: type2} = poker2) do
    
        type1 < type2
    end

    defp compare_pokers_(
        %Poker{} = poker1,
        %Poker{} = poker1) do
    
        true
    end

    ### ------------------ 比较牌的大小 end-------------------------

    defp caculate_size(?M) do
        1
    end

    defp caculate_size(poker_size) do
        poker_size - ?A + 1 + 1
    end

end