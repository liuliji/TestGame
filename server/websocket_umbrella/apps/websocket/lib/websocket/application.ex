defmodule Websocket.Application do
  require Logger
  @moduledoc """
  The Websocket Application Service.

  The websocket system business domain lives in this application.

  Exposes API to clients such as the `WebsocketWeb` application
  for use in channels, controllers, and elsewhere.
  """
  use Application

  @room_registry_name :room_registry
  def room_registry_name, do: @room_registry_name

  @user_registry_name :user_registry
  def user_registry_name, do: @user_registry_name

  def start(_type, _args) do
    import Supervisor.Spec, warn: false
    Logger.debug "start #{__MODULE__}"

    Supervisor.start_link([
      supervisor(Registry, [[keys: :unique, name: @room_registry_name]], id: @room_registry_name),
      supervisor(Websocket.RoomSupervisor, []),

      supervisor(Registry, [[keys: :unique, name: @user_registry_name]], id: @user_registry_name),
      supervisor(Websocket.UserSupervisor, []),
      
    ], strategy: :one_for_one, name: Websocket.Supervisor)
  end
end
