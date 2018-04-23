/************************************************************************
 * Copyright (c) 2017 App
 * Author    : liji.liu
 * Mail        : liuliji1184899343@163.com
 * Date        : 2018-03-11
 * Use      : 大厅收消息
 ************************************************************************/

var App = require('App');

/**
 * 创建房间
 * @param args 房间信息
 */
function oncreateRoom(args) {

    App.UIManager.emit('create_room',args);
}

/**
 * 加入房间
 * @param args 房间ID
 */
function onRoomInfoOnLobby(args) {
    // debugger;
    var roomId = args.room.room.roomId;// 房间ID
    // var content = args.content;// 房间内容
    App.UserManager.setRoom(args.room.room);
    // 创建房间成功之后，切换channel，连接到房间channel
    App.Socket.switchChannel('room:' + roomId);
}

/**
 *
 * @param args
 */
function onTalk(args) {

    App.UIManager.emit('talk',args);
}

/**
 * 创建房间成功，返回房间信息
 * @param args
 */
function onCreateRoomInfo(args) {
    var roomId = args.roomId;// 房间ID
    App.UserManager.setRoom(args);
    // 创建房间成功之后，切换channel，连接到房间channel
    App.Socket.switchChannel('room:' + roomId);

}

/**
 * 创建房间失败，服务器返回的错误信息
 * @param args
 */
function onCreateRoomFailed(args) {
    var code = args.code;// 错误码
    var reason = args.reason;// 错误原因
}


module.exports = {
    'oncreateRoom': oncreateRoom,// 创建房间
    'onRoomInfoOnLobby': onRoomInfoOnLobby,// 加入房间
    'onTalk': onTalk,// 说话聊天
    'onCreateRoomInfo': onCreateRoomInfo,// 创建房间成功，返回房间信息
    'onCreateRoomFailed': onCreateRoomFailed,// 创建房间失败，服务器返回的错误信息
}

