defmodule EnticeTest do
  use ExUnit.Case
  doctest Entice

  test "greets the world" do
    assert Entice.hello() == :world
  end
end
