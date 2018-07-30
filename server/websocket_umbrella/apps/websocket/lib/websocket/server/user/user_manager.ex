defmodule Websocket.UserManager do
    use GenServer
    require Logger


    @moduledoc """
    the module is deprecated.
    """

    @doc """
    User struct.
    :uid, :roomId, :userName, :socketId
    """
    defmodule User do
        defstruct(
            uid: "",
            pid: nil
            )
    end

    def start_link() do
        GenServer.start_link(__MODULE__, :ok, [{:name, __MODULE__}])
    end

    def init(:ok) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        user_manager init"
        {:ok, %{}}
    end

    # 不在socket那个process里面启动的该进程，因为当用户退出socket的时候，也会退出该进程
    def start_user(uid, userName, socketPid) do
        GenServer.call(__MODULE__, {:start_user, {uid, userName, socketPid}})
    end

    def get_user_pid(uid) do
        GenServer.call(__MODULE__, {:get_pid, uid})
    end


    # ------------------ Callback ----------------

    def handle_call({:start_user, {uid, userName, socketPid}}, _from, state) do
        {:ok, pid}  = Websocket.ServerUser.start_link(uid, userName, socketPid)
        {:reply, pid, state |> Map.put(uid, pid)}
    end

    def handle_call({:get_pid, uid}, _from, state) do
        {:reply, state |> Map.get(uid), state}
    end

end