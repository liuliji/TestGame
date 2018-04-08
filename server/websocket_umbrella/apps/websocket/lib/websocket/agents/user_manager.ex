defmodule Websocket.UserManager do
    use GenServer
    require Logger
    alias Websocket.UserManager.User

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
        GenServer.start_link(__MODULE__, :ok, [])
    end

    def init(:ok) do
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        inspect user_manager init"
        #{inspect info}"
        {:ok, %{}}
    end

    def get_user(uid) do
        GenServer.call(__MODULE__, {:get, uid})
    end

    def update_user(uid, pid) do
        GenServer.call(__MODULE__, {:updateUser, %User{uid: uid, pid: pid}})
    end

    def delete_user(uid) do
        GenServer.call(__MODULE__, {:deleteUser, %{uid: uid}})
    end


    # ------------------ Callback ----------------

    def handle_call({:get, uid}, _from, state) do
        {:reply, state |> Map.get(uid), state}
    end

    def handle_call({:updateUser, %{uid: uid, pid: pid}}, _from, state) do
        {:noreply, state |> Map.put(uid, %User{uid: uid, pid: pid})}
    end

    def handle_call({:deleteUser, %{uid: uid}}, _from, state) do
        {:noreply, state |> Map.delete(uid)}
    end

end