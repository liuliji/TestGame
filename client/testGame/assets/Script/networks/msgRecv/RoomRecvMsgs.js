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
    Log.debug('加入房间onJoinRoom————args ' + JSON.stringify(args));
    var userData = App.UserManager.setOtherUser(args);
    userData.setPlayerInfo(args);
    userData.userName = args.userName;
    if (args.position >= 0) {
        userData.position = args.position;
    } else {
        userData.position = 0;
    }

    App.UIManager.emit(Event.AGS_JOIN_ROOM, userData);
}

/**
 * 在房间中说话
 * @param args
 */
function onTalk(args) {

    App.UIManager.emit(Event.AGS_TALK, args);
}

/**
 * 获取房间信息
 * @param args
 */
function onRoomInfo(args) {
    // debugger;
    App.UIManager.hideAwait();
    var room = args.room;// 房间ID
    App.UserManager.setRoom(room);
    // 设置自己的信息
    var userSelf = args.userSelf;
    var selfData = App.UserManager.setSelf(userSelf);
    selfData.setPlayerInfo(userSelf);
    // selfData.userName = args.userName;

    // 设置其他玩家的信息
    var users = args.users;
    for (var i = 0; i < users.length; i++) {
        if (users[i].position != selfData.position) {
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
    App.UserManager.removeAllOtherUser();
    App.Socket.switchChannel('lobby');
}


/**
 * 玩家准备
 * @param args
 */
function onReady(args) {
    App.UIManager.addTips(' 有玩家准备 ', 1, cc.p(0, 0), cc.color(255, 255, 255), 26, true, 4, true);
    var userData = App.UserManager.getAllUserData(args.position);
    if (userData) {
        userData.readyStatus = true;
    }
    App.UIManager.emit(Event.AGS_READY, args.position);
}

/**
 * 游戏开始
 */
function onStartGame(args) {
    debugger;
    Log.debug('房主点击了开始游戏');
}

/**
 * 发牌
 */
function onFaPai(args) {
    var pokers = args.poker.pokers;
    var selfData = App.UserManager.getSelf();
    if (selfData) {
        selfData.pokers = pokers;
    }
    App.UserManager.foreachOtherUser(function (userData) {
        if (userData) {
            userData.pokers = [0, 0, 0];
        }
    });
    App.UIManager.emit(Event.AGS_FAPAI);
}


module.exports = {
    // 'oncreateRoom': oncreateRoom,// 创建房间
    'onJoinRoom': onJoinRoom,// 加入房间
    'onTalk': onTalk,// 说话聊天
    'onRoomInfo': onRoomInfo,// 加入房间成功，服务器给返回的房间信息
    'onDeleteRoom': onDeleteRoom,// 删除房间
    'onReady': onReady,// 玩家准备
    'onStartGame': onStartGame,// 房主点击开始游戏
    'onFaPai': onFaPai,// 发牌
}

