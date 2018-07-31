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
    // debugger;
    App.UIManager.showAwait();
    var msg = {
        roomId: roomId,
    };
    App.Socket.sendMsg('ID_C2S_DELETE_ROOM', msg);
}

/**
 * 房间中说话
 * @param roomId 房间ID
 */
function onRoomTalk(roomId) {

}

/**
 * 玩家点击准备
 */
function onReady() {
    var msg = {};
    App.Socket.sendMsg('ID_C2S_READY', msg);
}

/**
 * 房主点击开始游戏
 */
function onStartGame() {
    var msg = {};
    App.Socket.sendMsg('ID_C2S_START_GAME', msg);
}

/**
 * 
 */
function onActionExecute(aId, count = 0) {
    var msg = {
        aId: aId,
        count: count,
    };
    App.Socket.sendMsg('ID_C2S_ACTION_EXECUTE', msg);
}

module.exports = {
    'onRoomTalk': onRoomTalk,// 说话、聊天
    'onDeleteRoom': onDeleteRoom,// 删除房间
    'onReady': onReady,// 准备
    'onStartGame': onStartGame,// 房主点击开始游戏
    'onActionExecute': onActionExecute,// 玩家进行了什么操作
}


