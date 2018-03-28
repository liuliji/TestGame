defmodule Websocket.UserEntity do

    alias Entice.Entity
    alias Websocket.UserEntity.User
    alias Websocket.UserEntity.DefaultBehaviour
    require Logger

    defmodule User do
        defstruct(
            # 用户基本信息
            uid: "",
            userName: "",
            
            # 和房间相关信息
            roomId: "",
            roomOwner: "",
            position: -1,   # -1 是初始值，代表没有安排座位
            readyStatus: false,

            #游戏相关信息

            # 其他重要信息
            pid: nil,
            socketId: ""
            )
    end

    def start_link(uid, userName, socketId) do
        {:ok, pid} = Entity.start(uid, %{})
        Entity.put_behaviour(pid, DefaultBehaviour, %User{uid: uid, userName: userName, socketId: socketId, pid: pid})
        {:ok, pid}
    end

    def get_info(pid) do
        Entity.get_attribute(pid, User)
    end

    def get_attr(pid, key) do
        Entity.get_attribute(pid, User)[key]
    end

    def update_info(pid, map) do
        Entity.update_attribute(pid, User,
        fn user ->
            map |> Enum.map(fn {key, value} ->
                user |> Map.put(key, value)
                )
        end)
    end

    defmodule DefaultBehaviour do
        use Entice.Entity.Behaviour
        alias Entice.Entity

        # put_behaviour 会回调该behaviour的init方法
        def init(%Entity{attributes: attr} = entity, %User{pid: pid} = user) do

            entity = entity |> put_attribute(user)

            {:ok, %{state | attributes: attr}}
        end

        def handle_call(event, entity) do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            handle call #{inspect event}"
            {:ok, :ok, state}
        end

        def handle_event(event, entity) do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            #{inspect event}"
            {:ok, state}
        end


    end

end