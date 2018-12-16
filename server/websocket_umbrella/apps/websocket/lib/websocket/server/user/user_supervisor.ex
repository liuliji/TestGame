defmodule Websocket.UserSupervisor do

    use DynamicSupervisor
    alias Websocket.ServerUser
    alias Websocket.UserSupervisor
    require Logger

    def start_link do
        ret = DynamicSupervisor.start_link(__MODULE__, :ok, [name: __MODULE__])
        # 初始化 登陆之后 保存所有用户信息的 ets
        :ets.new(:ets_user, [:set, :named_table, :public, {:read_concurrency, true}, {:write_concurrency, true}])
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        create ets user"

        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        #{inspect __MODULE__} start #{inspect ret}"
        ret
    end

    @imp true
    def init(:ok) do
        DynamicSupervisor.init([
            strategy: :one_for_one,
            max_restarts: 3,
            max_seconds: 5,
            max_children: :infinity, # :infinity is default value
        ])
    end

    def new_user(userId, userName, socketPid) do

        case :ets.lookup(:ets_user, userName) do
            [] -> 
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                #{userName} start a new user"
                :ets.insert(:ets_user, {userName, userId})
                Logger.info "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                insert user in ets userName:#{userName}, userId:#{userId}, socketPid:#{inspect socketPid}"
                {userId, start_new_user(userId, userName, socketPid)}
            [{_, uId}] ->
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                find disconnected user. #{inspect userName}, #{uId}, new socketPid:#{inspect socketPid}"
                pid = find_user(uId)
                Logger.info "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                find user in ets userName:#{userName}, userId:#{uId}, socketPid:#{inspect pid}"
                {uId, pid}
        end

    end

    # 通过DynamicSupervisor 启动的 user_server，当user_server正常死了之后，不会重启
    defp start_new_user(userId, userName, socketPid) do
        c_spec = %{
            id: userId,
            start: {ServerUser, :start_link, [userId, userName, socketPid]},
            restart: :transient, # 非:normal, :shutdown, {:shutdown, term} 重启
            type: :worker
        }
        {:ok, pid} = DynamicSupervisor.start_child(__MODULE__, c_spec)
        pid
    end

    def find_user(userId) do
        case Registry.lookup(Websocket.Application.user_registry_name, userId) do
            [] -> {:error, "user not exist"}
            [{_, pid}] -> pid
        end
    end

    def del_user(userId) do
        DynamicSupervisor.terminate_child(__MODULE__, find_user(userId))
    end

end