defmodule Websocket.Application do
  require Logger
  @moduledoc """
  The Websocket Application Service.

  The websocket system business domain lives in this application.

  Exposes API to clients such as the `WebsocketWeb` application
  for use in channels, controllers, and elsewhere.
  """
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false
    Logger.debug "start #{__MODULE__}"

    Supervisor.start_link([
      supervisor(Websocket.RoomManager, []),
      supervisor(Websocket.UserManager, [])
    ], strategy: :one_for_one, name: Websocket.Supervisor)
  end
end
