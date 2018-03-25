defmodule Websocket.UserEntity do

    alias Entice.Entity
    alias Websocket.UserEntity.User
    alias Websocket.UserEntity.DefaultBehaviour
    require Logger

    defmodule User do
        defstruct(
            uid: "",
            roomId: "",
            userName: "",
            socketId: ""
            )
    end

    def start_link(uid, userName) do
        {:ok, pid} = Entity.start(uid, %User{uid: uid, userName: userName, socketId: uid})
    end

    def test(pid) do
        attr = Entity.get_attribute(pid, :userName)
        Entity.call_behaviour(pid, DefaultBehaviour, :test_behaviour)
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        #{inspect attr}"
    end

    defmodule DefaultBehaviour do
        use Entity.Behaviour

        # put_behaviour 会回调该behaviour的init方法
        def init([state, args] = list) do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            #{inspect list}"
            {:ok, state}
        end

        def handle_call(event, state) do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            handle call #{inspect event}"
            {:ok, :ok, state}
        end

        def handle_event(event, state) do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            #{inspect }"
            {:ok, state}
        end

        def test_behaviour() do
            Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
            test behaviour"
        end

    end

end