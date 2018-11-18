defmodule Websocket.UserSupervisor do

    use DynamicSupervisor
    alias Websocket.ServerUser
    alias Websocket.UserSupervisor
    require Logger

    def start_link do
        ret = DynamicSupervisor.start_link(__MODULE__, :ok, [name: __MODULE__])
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
        case :ets.info(:ets_user) do
            :undefined ->
                :ets.new(:ets_user, [:set, :named_table, :public])
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                create ets user"
            _ ->
                :ok
        end
        

        case :ets.lookup(:ets_user, userName) do
            [] -> 
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                #{userName} start a new user"
                :ets.insert(:ets_user, {userName, userId})
                {userId, start_new_user(userId, userName, socketPid)}
            [{_, uId}] ->
                Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
                find disconnected user. #{inspect userName}, #{uId}, new socketPid:{inspect socketPid}"
                pid = find_user(uId)
                Websocket.ServerUser.update_info(pid, :socketPid, socketPid)
                {uId, pid}
        end

        
    end

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