defmodule WebsocketWeb.UserSocket do
  use Phoenix.Socket
  require Logger
# 连接了socket之后，收到的消息和发出的消息都会被路由到channels。
# 从客户端来的数据会通过transports被路由到channels
# socket的责任之一就是将transports 和 channels 绑定到一起

#socket 被挂载到endpoints上的

# socket 一共三个方法两个回调，剩下的一个方法是 assign(socket, key, value)

  ## Channels
  #  Phoenix.Socket.channel/2 方法定义了channel和topic的映射关系
  channel "room:*", WebsocketWeb.RoomChannel

  ## Transports
  # phx 支持websocket和longpoll两种传输方式
  transport :websocket, Phoenix.Transports.WebSocket
  # transport :longpoll, Phoenix.Transports.LongPoll

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  #     {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error`.
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.
  def connect(_params, socket) do
    Logger.debug "params:#{inspect _params} connect to socket:#{inspect socket}"
    {:ok, socket}
  end

  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "user_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     WebsocketWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous(匿名).
  # id 通常被用来标志一个socket链接，上面展示了通常用法。
  def id(_socket) do
    Logger.debug "id:#{inspect _socket}"
    nil
  end
end
