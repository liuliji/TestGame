/************************************************************************
 * Copyright (c) 2017 App
 * Author	: liji.liu
 * Mail		: liuliji1184899343@163.com
 * Date		: 2018-03-11
 * Use      : 大厅发送消息
 ************************************************************************/

// var WSph = require('WSph');

var App = require('App');

/**
 * 创建房间
 * @param info 房间信息
 */
function onCreateRoom(info) {
    var msg = {};
    App.UIManager.showAwait();
    App.Socket.sendMsg('ID_C2S_CREATE_ROOM',msg);
}

/**
 * 加入房间
 * @param roomId 房间ID
 */
function onJoinRoomOnLobby(roomId) {
    // debugger;
    var msg = {
        roomId: roomId,
    };
    App.UIManager.showAwait();
    App.Socket.sendMsg('ID_C2S_JOIN_ROOM_ON_LOBBY',msg);
}

function onTalk(content) {
    var msg = {
        content: content,
    };
    App.Socket.sendMsg('ID_C2S_TALK',msg);
}

module.exports = {
    'onCreateRoom': onCreateRoom,// 创建房间
    'onJoinRoomOnLobby': onJoinRoomOnLobby,// 加入房间
    'onTalk': onTalk,// 说话、聊天
}


