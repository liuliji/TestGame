defmodule Websocket.ServerUser2 do

    alias Entice.Entity
    require Logger
    alias Websocket.ServerUser2.User
    alias Websocket.ServerUser2, as: ServerUser

    defmodule User do

        @type t :: %User{
            # 用户基本信息
            uid: String.t,
            userName: String.t,
            online: boolean,
            curMoney: integer,
            originMoney: integer,

            pid: pid,
            socketPid: pid,
            channelPid: pid,

            # 房间信息
            roomId: String.t,
            roomOwner: boolean,
            position: integer,
            readyStatus: boolean,
            
            roomPid: pid,

            # 牌信息
            poker: Websocket.Poker.t
            
        }

        defstruct(
            uid: "",
            userName: "",
            curMoney: 0,
            originMoney: 100,
            online: true,
            pid: nil,
            socketPid: nil,
            channelPid: nil,

            # inner 
            roomId: "",
            roomOwner: false,
            position: -1,
            readyStatus: false,
            roomPid: nil,

            poker: nil
            )
    end
    
    def start_link(uid, userName, socketPid) do
        {:ok, pid} = Entity.start()
        Logger.debug "file:#{inspect Path.basename(__ENV__.file)} line:#{__ENV__.line}
        start user uid:#{uid} uname:#{userName}"
        Registry.register(Websocket.Application.user_registry_name, uid, pid)
        Entity.put_behaviour(pid, DefaultBehaviour, %User{uid: uid, userName: userName, pid: pid, socketPid: socketPid})
        {:ok, pid}
    end

end