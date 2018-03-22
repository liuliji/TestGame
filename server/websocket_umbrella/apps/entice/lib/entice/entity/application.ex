defmodule Entice.Application do
  use Application
  alias Entice.Entity.{Coordination, Supervisor}

  def start(_type, _args) do
    Coordination.start()
    Supervisor.start_link()
  end

  def start do
    Coordination.start()
    Supervisor.start_link()
  end
end
