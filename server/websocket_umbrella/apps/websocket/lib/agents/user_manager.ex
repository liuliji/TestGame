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
            roomId: "",
            userName: "",
            socketId: ""
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

    def update_user_room_id(uid, roomId) do
        GenServer.call(__MODULE__, {:updateRoomId, uid, roomId})
        update_user(%{get_user(uid) | roomId: roomId})
    end

    def update_user(user) do
        GenServer.call(__MODULE__, {:updateUser, %{user: user}})
    end

    def delete_user(uid) do
        GenServer.call(__MODULE__, {:deleteUser, %{uid: uid}})
    end


    # ------------------ Callback ----------------

    def handle_call({:updateRoomId, uid, roomId}, _from, state) do
        case state |> Map.get(uid) do
            nil ->
                {:reply, {:error, %{msg: "invalid uid"}}, state}
            user ->
                {:reply, :ok, state |> Map.put(uid, %{user | roomId: roomId})}
        end
    end

    def handle_call({:get, uid}, _from, state) do
        {:reply, state |> Map.get(uid), state}
    end

    def handle_call({:updateUser, %{user: user}}, _from, state) do
        {:noreply, state |> Map.put(user.uid, user)}
    end

    def handle_call({:deleteUser, %{uid: uid}}, _from, state) do
        {:noreply, state |> Map.delete(uid)}
    end

end