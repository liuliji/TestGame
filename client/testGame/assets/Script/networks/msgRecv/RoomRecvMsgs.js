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
    debugger;
    Log.debug('加入房间onJoinRoom————args ' + JSON.stringify(args) );
    var userData = App.UserManager.setOtherUser(args);
    userData.userName = args.userName;
    if (args.position >= 0){
        userData.position = args.position;
    } else {
        userData.position = 0;
    }

    App.UIManager.emit(Event.AGS_JOIN_ROOM,userData);
}

/**
 *
 * @param args
 */
function onTalk(args) {

    App.UIManager.emit(Event.AGS_TALK,args);
}

/**
 * 获取房间信息
 * @param args
 */
function onRoomInfo(args) {
    debugger;
    App.UIManager.hideAwait();
    var room = args.room;// 房间ID
    App.UserManager.setRoom(room);
    // 设置自己的信息
    var userSelf = args.userSelf;
    var selfData = App.UserManager.setSelf(userSelf);
    // selfData.userName = args.userName;

    // 设置其他玩家的信息
    var users = args.users;
    for (var i = 0; i < users.length; i ++){
        if (users[i].position != selfData.position){
            let userData = App.UserManager.setOtherUser(users[i]);
            userData.setPlayerInfo(users[i]);
        }
    }

    App.MsgDispatcher.setCanProcessMsg(false);
    cc.director.loadScene('game');
}

/**
 * 删除房间
 * @param args
 */
function onDeleteRoom(args) {
    // debugger;
    var content = args.content;
    Log.debug('删除房间信息：' + content);
    App.Socket.switchChannel('lobby');
}


module.exports = {
    // 'oncreateRoom': oncreateRoom,// 创建房间
    'onJoinRoom': onJoinRoom,// 加入房间
    'onTalk': onTalk,// 说话聊天
    'onRoomInfo': onRoomInfo,// 加入房间成功，服务器给返回的房间信息
    'onDeleteRoom': onDeleteRoom,// 删除房间
}

