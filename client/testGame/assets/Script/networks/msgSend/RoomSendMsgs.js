/************************************************************************
 * Copyright (c) 2017 App
 * Author	: liji.liu
 * Mail		: liuliji1184899343@163.com
 * Date		: 2018-03-15
 * Use      : 房间发送消息
 ************************************************************************/

// var WSph = require('WSph');

var App = require('App');


/**
 * 删除房间
 * @param info
 */
function onDeleteRoom(roomId) {
    var msg = {
        roomId: roomId,
    };
    App.Socket.sendMsg('ID_C2S_CREATE_ROOM',msg);
}

/**
 * 房间中说话
 * @param roomId 房间ID
 */
function onRoomTalk(roomId) {

}

module.exports = {
    'onRoomTalk': onRoomTalk,// 说话、聊天
}


