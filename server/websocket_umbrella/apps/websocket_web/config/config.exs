# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :websocket_web,
  namespace: WebsocketWeb

# Configures the endpoint
config :websocket_web, WebsocketWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "yPffld4J9tB746iFW/s1+GM5RFAbCwPEHu38GBwPM7CAZ4K5GlVdzptyurL6wSyV",
  render_errors: [view: WebsocketWeb.ErrorView, accepts: ~w(json)],
  pubsub: [name: WebsocketWeb.PubSub,
           adapter: Phoenix.PubSub.PG2]

config :websocket_web, :generators,
  context_app: :websocket

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
