# Websocket.Umbrella


在Phoenix框架中，对于socket的支持，整个流程可以看做是 `socket连接接收消息` -> `房间处理消息` -> `返回给socket消息`

其实，在考虑到断线的情况之后（断线就是socket断开连接，所以这时候socket的状态就丢失了），整个流程应该是： `socket连接接收消息` -> `将消息传递给内部房间逻辑服务` -> `内部房间服务处理消息` -> `将消息发给socket房间` -> `socket房间将消息广播给用户` 如果出现了某用户断线的情况，该用户的socket虽然断开了连接，这时 该用户不会再发出消息了，但是还是能正常的处理接收消息，不影响整个游戏的进行。


其实，上面的流程当中，到底是用户socket的接收的消息，还是房间channel接收的消息？ 其实上面是有一点模糊的。最细致的服务器游戏流程应该是： `socket连接 接收消息` -> `传递给内部用户处理` -> `传递给内部房间广播还是单发` -> `内部用户处理消息` -> `传递给socket当前的用户信息` -> `socket传递消息给客户端` 整个链条就是：**socket - inner_user - inner_room - inner_user - socket**。 这样分工明确，但是真正这样设计的话又有点繁琐，所以用的最多的就是第二种。


> 我发现，只要弄清楚了整个通信流程，每个上下文变量中应该存储什么值也就确定了。


### 本工程

命名规范：
- 和客户端的消息ID： 全部大写、_ 分割
- struct：驼峰，
- 给客户端返回的消息体： 驼峰
- 内部消息：驼峰
- 方法命名：全部小写、_ 分割

-----------

- `消息传递过程`：当socket收到客户端发过来消息之后，socket基本不做处理（），仅仅是转发给内部的服务系统中的user_server，user_server这时候基本不做数据处理（除非不更新 没办法继续），将消息发送给room_server，room_server处理了该消息之后 更新房间数据并通知到user_server，user_server更新数据处理了该消息之后，再通知socket，然后由socket返回给客户端。

> 注意： 数据应在room_server处理了消息之后才开始更新；整个消息传递过程中，注意传递参数的合理性，如果传递了不正常的参数，那么说明内存中存储的数据有问题（不够用）；

------------

- `运行时数据`：在socket中，保存了uid，pid，userName，roomId，roomPid；在user_server中保存了user的这种信息，想要获取相关信息，必须通过pid来发送消息；在room_server中保存了room的相关消息，user_list中是{uid, pid}的二元组，另外用list保存uid，index为position来保存用户座位信息；room_manager保存了所有room的roomid和roomPid；

------------

#### 断线重连详细逻辑

**`项目process介绍`**

 - `UserManager` 管理用户的process。用于启动user_process，管理所有用户的process。
 - `RoomManager` 管理房间的process，也可以是叫做管理房间游戏的process。所有的room_process都由他启动。

 - `socketPid` 每一个socket连接进来之后，都会启动一个process，他的pid是`scoket.transport_pid`，当用户socket断开的时候，该process也会注销
 - `channelPid` 当socket register某个topic（代码中就是join了某个channel）的时候，phoenix也会启动一个process，pid是`socket.channel_pid`。
 - `userPid` 当建立一个socket连接之后，server（指的是服务器内部的游戏服务）会启动一个user_process，用于处理所有用户相关的消息，基于erlang的OTP，该process由UserManager来启动。
 - `roomPid` 创建一个游戏房间之后，会启动一个room_process，处理所有房间和游戏中的消息。

-------

 **`server`运行生态**

 当用户加入一个房间的时候，就加入了一个房间生态。房间的状态基本分为`游戏中`和`非游戏中`。

 房间生态主要指的是room_process，负责接收user_process的操作消息，更新房间数据，发消息给user_process，让user_process更新状态。

 - `非游戏状态` 用户离开房间（包括掉线，这时候会直接退出房间）、加入房间，等都和客户端保持一致。如果房间解散，该房间也会解散。
 - `游戏状态` 用户不可以离开房间和加入房间。（以后可能会考虑强制退出，也就是逃跑的情况）。房间也不会解散。如果用户掉线，user_process会收到断开socket连接的消息并更新用户的状态为掉线，这种情况下，user_process依然可以正常处理room_process发过来的消息，更新状态，当轮到该用户发言时，系统会发送消息给room_process，并跳过发言。


 **`socket`运行生态**

 退出房间：
 - `主动` 不是游戏中时，直接退出，并且退出room_process。游戏中时，相当于强制退出，也会退出room_process，并且需要更新room_process和user_process的数据。
 - `被动` 比如说是掉线了。非游戏中，直接退出房间，甚至直接注销user_process都可以。如果是游戏中，就是断线重连了，更新user_process状态就可以了。

 断开连接： 就是当做断线处理就可以了。


 **注意问题**
 1. 断线重连只会发生在游戏中，如果游戏结束了，还未连接上，这块逻辑记着处理。
 2. user_process，要monitor socketPid，用于断线重连；要monitor channelPid，如果是强制退出，要更新user_process和room_process的状态，如果是非强制退出，标记为掉线就可以了。
 3. room_process，要monitor user_process，仅仅用于极特殊的user_process异常注销了。如果user_process都异常注销了，那么可以认为是强制退出。正常情况下，user_process退出房间都是通过发消息的。有monitor 就有 注销monitor。





