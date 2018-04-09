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
