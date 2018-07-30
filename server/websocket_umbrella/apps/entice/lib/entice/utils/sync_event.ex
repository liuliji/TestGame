defmodule Entice.Utils.SyncEvent do
  @moduledoc """
  Represents a gen_event where handlers are synchronized on the same state.

  If a handler is removed, the reason passed into terminate will be:

      :remove_handler

  If a handler is exchanged for another handler with `become` (see the callbacks),
  the reason passed into terminate will be:

      {:become_handler, new_handler :: atom, args :: term}
  """
  use GenServer
  use Behaviour
  import Set

  # Handler API

  defcallback(
    init(state :: term, args :: term) ::
      {:ok, state :: term}
      | {:error, reason :: term}
  )

  defcallback(
    handle_event(event :: String.t(), state :: term) ::
      {:ok, state :: term}
      | {:become, new_handler :: atom, args :: term, state :: term}
      | {:stop, reason :: term, state :: term}
      | {:stop_process, reason :: term, state :: term}
      | {:error, reason :: term}
  )

  defcallback(
    handle_change(old_state :: map, state :: map) ::
      :ok
      | {:error, reason :: term}
  )

  defcallback(
    handle_call(event :: String.t(), state :: term) ::
      {:ok, reply :: term, state :: term}
      | {:become, reply :: term, new_handler :: atom, args :: term, state :: term}
      | {:stop, reason :: term, reply :: term, state :: term}
      | {:stop_process, reason :: term, reply :: term, state :: term}
      | {:error, reason :: term}
  )

  defcallback(
    terminate(reason :: term, state :: term) ::
      {:ok, state :: term}
      | {:error, reason :: term}
  )

  defmacro __using__(_) do
    quote do
      @behaviour unquote(__MODULE__)

      def init(state, _args), do: {:ok, state}

      def handle_event(event, state), do: {:ok, state}

      def handle_change(old_state, state), do: :ok

      def handle_call(event, state), do: {:ok, nil, state}

      def terminate(_reason, state), do: {:ok, state}

      defoverridable init: 2, handle_event: 2, handle_change: 2, handle_call: 2, terminate: 2
    end
  end

  # Manager API

  def start_link(state, opts \\ []),
    do: GenServer.start_link(__MODULE__, %{handlers: HashSet.new(), state: state}, opts)

  def has_handler?(manager, handler) when is_pid(manager) and is_atom(handler),
    do: GenServer.call(manager, {:has_handler, handler})

  def put_handler(manager, handler, args) when is_pid(manager) and is_atom(handler),
    do: GenServer.cast(manager, {:put_handler, handler, args})

  def remove_handler(manager, handler) when is_pid(manager) and is_atom(handler),
    do: GenServer.cast(manager, {:remove_handler, handler})

  def notify(manager, event) when is_pid(manager) do
    send(manager, event)
    :ok
  end

  def call(manager, handler, event) when is_pid(manager) and is_atom(handler),
    do: GenServer.call(manager, {:call, handler, event})

  # Backend

  def init(args) do
    Process.flag(:trap_exit, true)
    {:ok, args}
  end

  def handle_call({:has_handler, handler}, _from, state),
    do: {:reply, state.handlers |> member?(handler), state}

  def handle_call({:call, handler, event}, _from, state) do
    case state.handlers |> member?(handler) do
      false ->
        {:ok, {:error, :not_found}, state.handlers, state.state}

      true ->
        handler
        |> handler_call(event, state.state)
        |> result_call(handler, state.handlers)
    end
    |> case do
         {:ok, reply, new_handlers, new_state} ->
           state_changed(state.state, new_state, state)
           {:reply, reply, %{handlers: new_handlers, state: new_state}}

         {:stop, reason, reply, new_handlers, new_state} ->
           state_changed(state.state, new_state, state)
           {:stop, reason, reply, %{handlers: new_handlers, state: new_state}}
       end
  end

  def handle_call(msg, from, state), do: super(msg, from, state)

  def handle_cast({:put_handler, handler, args}, state) do
    {:ok, new_handlers, new_state} =
      handler
      |> handler_init(state.state, args)
      |> result_notify(handler, state.handlers)

    state_changed(state.state, new_state, state)
    {:noreply, %{handlers: new_handlers, state: new_state}}
  end

  def handle_cast({:remove_handler, handler}, state) do
    {:ok, new_handlers, new_state} =
      case state.handlers |> member?(handler) do
        false ->
          {:ok, state.handlers, state.state}

        true ->
          handler
          |> handler_terminate(:remove_handler, state.state)
          |> handler_exit_result(handler, state.handlers)
      end

    state_changed(state.state, new_state, state)
    {:noreply, %{handlers: new_handlers, state: new_state}}
  end

  def handle_cast(msg, state), do: super(msg, state)

  def handle_info(event, state) do
    Enum.reduce(state.handlers, {:ok, state.handlers, state.state}, fn
      _handler, {:stop, _r, _h, _s} = stop ->
        stop

      handler, {:ok, h, s} ->
        handler
        |> handler_event(event, s)
        |> result_notify(handler, h)
    end)
    |> case do
         {:ok, new_handlers, new_state} ->
           state_changed(state.state, new_state, state)
           {:noreply, %{handlers: new_handlers, state: new_state}}

         {:stop, reason, new_handlers, new_state} ->
           state_changed(state.state, new_state, state)
           {:stop, reason, %{handlers: new_handlers, state: new_state}}
       end
  end

  def terminate(reason, state) do
    Enum.reduce(state.handlers, {:ok, state.handlers, state.state}, fn handler, {:ok, h, s} ->
      handler
      |> handler_terminate(reason, s)
      |> handler_exit_result(handler, h)
    end)

    :ok
  end

  defp state_changed(old, new, _state) when old == new, do: :ok

  defp state_changed(old, new, state) when old != new do
    for handler <- state.handlers do
      handler
      |> handler_change(old, new)
      |> result_change(handler, old, new)
    end
  end

  # Backend Handler callbacks

  defp handler_init(handler, state, args), do: apply(handler, :init, [state, args])

  defp handler_event(handler, event, state) do
    try do
      apply(handler, :handle_event, [event, state])
    rescue
      _ in FunctionClauseError -> {:ok, state}
    end
  end

  defp handler_change(handler, old_state, state) do
    try do
      apply(handler, :handle_change, [old_state, state])
    rescue
      _ in FunctionClauseError -> :ok
    end
  end

  defp handler_call(handler, event, state), do: apply(handler, :handle_call, [event, state])

  defp handler_terminate(handler, reason, state), do: apply(handler, :terminate, [reason, state])

  # Backend Handler results

  defp result_notify({:ok, state}, handler, handlers), do: {:ok, handlers |> put(handler), state}

  defp result_notify({:stop, reason, state}, handler, handlers) do
    handler
    |> handler_terminate(reason, state)
    |> handler_exit_result(handler, handlers)
  end

  defp result_notify({:stop_process, reason, state}, handler, handlers),
    do: {:stop, reason, handlers |> put(handler), state}

  defp result_notify({:become, new_handler, args, state}, handler, handlers) do
    {:ok, new_handlers, new_state} =
      handler
      |> handler_terminate({:become_handler, new_handler, args}, state)
      |> handler_exit_result(handler, handlers)

    new_handler
    |> handler_init(new_state, args)
    |> result_notify(new_handler, new_handlers)
  end

  defp result_notify({:error, reason}, handler, _handlers),
    do: raise("Error in handler #{inspect(handler)} because of: #{inspect(reason)}")

  defp result_notify(return, handler, _handlers),
    do:
      raise(
        "Return was incorrect in handler #{inspect(handler)}. Check the API documentation for handlers. Got: #{
          inspect(return)
        }"
      )

  defp result_change(:ok, _handler, _old, _new), do: :ok

  defp result_change({:error, reason}, handler, old, new),
    do:
      raise(
        "Error while state change notify in handler #{inspect(handler)} because of: #{
          inspect(reason)
        }. Old state: #{inspect(old)}. New state: #{inspect(new)}"
      )

  defp result_change(return, handler, _old, _new),
    do:
      raise(
        "Return was incorrect in handler #{inspect(handler)}. Check the API documentation for handlers. Got: #{
          inspect(return)
        }"
      )

  defp result_call({:ok, reply, state}, handler, handlers),
    do: {:ok, reply, handlers |> put(handler), state}

  defp result_call({:stop, reason, reply, state}, handler, handlers) do
    {:ok, new_handlers, new_state} =
      handler
      |> handler_terminate(reason, state)
      |> handler_exit_result(handler, handlers)

    {:ok, reply, new_handlers, new_state}
  end

  defp result_call({:stop_process, reason, reply, state}, handler, handlers),
    do: {:stop, reason, reply, handlers |> put(handler), state}

  defp result_call({:become, reply, new_handler, args, state}, handler, handlers) do
    {:ok, new_handlers, new_state} =
      handler
      |> handler_terminate({:become_handler, new_handler, args}, state)
      |> handler_exit_result(handler, handlers)

    {:ok, new_handlers, new_state} =
      new_handler
      |> handler_init(new_state, args)
      |> result_call(new_handler, new_handlers)

    {:ok, reply, new_handlers, new_state}
  end

  defp result_call({:error, reason}, handler, _handlers),
    do: raise("Error in handler #{inspect(handler)} because of: #{inspect(reason)}")

  defp result_call(return, handler, _handlers),
    do:
      raise(
        "Return was incorrect in handler #{inspect(handler)}. Check the API documentation for handlers. Got: #{
          inspect(return)
        }"
      )

  defp handler_exit_result({:ok, state}, handler, handlers),
    do: {:ok, handlers |> delete(handler), state}

  defp handler_exit_result({:error, reason}, handler, _handlers),
    do: raise("Error in handler #{inspect(handler)} because of: #{inspect(reason)}")

  defp handler_exit_result(return, _handler, _handlers),
    do:
      raise(
        "Return was incorrect. Check the API documentation for behaviours. Got: #{inspect(return)}"
      )
end
