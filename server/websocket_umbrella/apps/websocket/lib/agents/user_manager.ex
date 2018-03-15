defmodule Websocket.UserManager do
    use GenServer
    require Logger
    alias Websocket.UserManager.User

    defmodule User do
        defstruct(
            uid: "",
            room_id: "",
            user_name: "",
            socket_id: ""
            )
    end

    def start_link() do
        GenServer.start_link(__MODULE__, :ok, [])
    end

    def init(:ok) do
        {:ok, %{}}
    end

    def get_user(uid) do
        GenServer.call(__MODULE__, {:get, uid})
    end

    def update_user_room_id(uid, room_id) do
        GenServer.call(__MODULE__, {:update_room_id, uid, room_id})
        update_user(%{get_user(uid) | room_id: room_id})
    end

    def update_user(user) do
        GenServer.call(__MODULE__, {:update_user, %{user: user}})
    end

    def delete_user(uid) do
        GenServer.call(__MODULE__, {:delete_user, %{uid: uid}})
    end


    # ------------------ Callback ----------------

    def handle_call({:update_room_id, uid, room_id}, _from, state) do
        case state |> Map.get(uid) do
            nil ->
                {:reply, {:error, %{msg: "invalid uid"}}, state}
            user ->
                {:reply, :ok, state |> Map.put(uid, %{user | room_id: room_id})}
        end
    end

    def handle_call({:get, uid}, _from, state) do
        {:reply, state |> Map.get(uid), state}
    end

    def handle_call({:update_user, %{user: user}}, _from, state) do
        {:noreply, state |> Map.put(user.uid, user)}
    end

    def handle_call({:delete_user, %{uid: uid}}, _from, state) do
        {:noreply, state |> Map.delete(uid)}
    end

end