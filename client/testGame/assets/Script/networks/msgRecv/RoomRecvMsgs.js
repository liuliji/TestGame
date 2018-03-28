/************************************************************************
 * Copyright (c) 2017 App
 * Author    : liji.liu
 * Mail        : liuliji1184899343@163.com
 * Date        : 2018-03-15
 * Use      : 房间收消息
 ************************************************************************/

var App = require('App');
var Event = require('Consts').AgreementEvent;
var Consts = require('Consts');

/**
 * 创建房间
 * @param args 房间信息
 */
// function oncreateRoom(args) {
//
//     App.UIManager.emit('create_room',args);
// }

/**
 * 加入房间
 * @param args 房间ID
 */
function onJoinRoom(args) {
    // debugger;
    Log.debug('加入房间onJoinRoom————args ' + JSON.stringify(args) );
    var selfData = App.UserManager.setSelf(args);
    selfData.nickName = args.userName;
    selfData.position = 0;
    App.UIManager.emit(Event.AGS_JOIN_ROOM,selfData);
}

/**
 *
 * @param args
 */
function onTalk(args) {

    App.UIManager.emit(Event.AGS_TALK,args);
}

/**
 *
 * @param args
 */
function onRoomInfo(args) {
    // debugger;
    var roomId = args.roomId;// 房间ID
    App.UserManager.setRoom(args);
    App.MsgDispatcher.setCanProcessMsg(false);
    cc.director.loadScene('game');
}

module.exports = {
    // 'oncreateRoom': oncreateRoom,// 创建房间
    'onJoinRoom': onJoinRoom,// 加入房间
    'onTalk': onTalk,// 说话聊天
    'onRoomInfo': onRoomInfo,// 加入房间成功，服务器给返回的房间信息
}

