defmodule WebsocketWeb.Router do
  use WebsocketWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", WebsocketWeb do
    pipe_through :api
  end
end
