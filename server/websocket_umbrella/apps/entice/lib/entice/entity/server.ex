defmodule Entice.Entity.Server do
  alias Entice.Utils.SyncEvent

  def start_link(args), do: SyncEvent.start_link(args)
end
