defmodule Websocket.ServerUser.Attr do
    alias Entice.Entity
    alias Websocket.ServerUser2.User
    require Logger

    @doc """
     Entity.get_attribute 这种方式最后也是调用的 Attribute.Behaviour 的相关方法 然后发送同步消息 获取信息
     所以也可以说 该模块是对 Attribute.Behaviour 模块的封装
     所以 应该注意，获取的相关消息，全是发送的同步消息
    """

    def user_info(pid) do
        Entity.get_attribute(pid, User)
    end

    def update_info(pid, key, value) do
        Entity.update_attribute(pid, User, fn
            %User{} = user ->
                if (Map.has_key?(user, key)) do
                    Map.update!(user, key, fn _ -> value end)
                else
                    user
                end
        end)
    end

end