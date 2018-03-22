defmodule Entice.Entity.Suicide do
  @moduledoc """
  This module lets us stop an entity by sending a poison pill message.
  This can be used to terminate an entity without the need of using the
  Entity.stop/1 functionality.
  (E.g. if you are referring to the entity indirectly via coordination etc.
  """
  alias Entice.Entity
  alias Entice.Entity.{Coordination, Suicide}

  def register(entity), do: Entity.put_behaviour(entity, Suicide.Behaviour, [])

  def unregister(entity), do: Entity.remove_behaviour(entity, Suicide.Behaviour)

  @doc "Idea taken from Akka, terminates the entity normally"
  def poison_pill(entity), do: Coordination.notify(entity, poison_pill_message)

  @doc """
  Instead of using the direct poison pill function, this message
  can also be sent (e.g. broadcasted)
  """
  def poison_pill_message, do: :suicide_poison_pill

  defmodule Behaviour do
    use Entice.Entity.Behaviour

    def handle_event(:suicide_poison_pill, entity), do: {:stop_process, :normal, entity}
  end
end
