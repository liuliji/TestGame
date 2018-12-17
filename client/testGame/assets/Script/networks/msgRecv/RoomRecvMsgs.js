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
var ROOM_STATUS = require('Consts').ROOM_STATUS;// 房间状态

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
    let selfData = App.UserManager.getSelf();
    if (selfData && selfData.position != args.position){
        App.UIManager.addTips(' 有玩家准备 ', 1, cc.p(0, 0), cc.color(255, 255, 255), 26, true, 4, true);
    }
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

/**
 * 操作信息
 */
function onActionInfo(args) {
    App.UIManager.emit(Event.AGS_ACTION_INFO, args);
}

/**
 * 自己看牌
 */
function onKanPai(args) {
    // debugger;
    var pokers = args.poker.pokers;
    if (!pokers) {
        return;
    }
    var selfData = App.UserManager.getSelf();
    if (!selfData) {
        return;
    }
    selfData.pokers = pokers;
    App.UIManager.emit(Event.AGS_KAN_PAI);
}

/**
 * 其他人看牌
 */
function onOtherKanPai(args) {
    // debugger;
    App.UIManager.emit(Event.AGS_OTHER_KAN_PAI, args);
}

/**
 * 自己押注
 */
function onYaZhu(args) {
    // debugger;
    App.UIManager.emit(Event.AGS_YA_ZHU, args);
}

/**
 * 其他人押注
 */
function onOtherYaZhu(args) {
    // debugger;
    App.UIManager.emit(Event.AGS_OTHER_YA_ZHU, args);
}

/**
 * 押注失败
 */
function onYaZhuFailed(args) {
    // debugger;
    App.UIManager.addTips(' 下注失败 ' + args.msg, 1, cc.p(0, 0), cc.color(255, 255, 255), 26, true, 4, true);
    App.UIManager.emit(Event.AGS_YA_ZHU_FAILED);
}

/**
 * 自己弃牌
 */
function onQiPai(args) {
    // debugger;
    App.UIManager.emit(Event.AGS_QI_PAI);
}

/**
 * 其他人弃牌
 */
function onOtherQiPai(args) {
    // debugger;
    App.UIManager.emit(Event.AGS_OTHER_QI_PAI, args);
}

/**
 * 开牌
 */
function onGameResult(args) {
    Log.debug('开牌结果' + JSON.stringify(args));
    App.UserManager.foreachAllUser(function (userData) {
        if (!userData) {
            return;
        }
        userData.readyStatus = false;// 游戏开牌后，所有人的准备状态置为false
    }.bind(this));
    // debugger;
    var users = args.users;
    for (var i = 0; i < users.length; i++) {
        let user = users[i];
        let userData = App.UserManager.getAllUserData(user.position);
        if (userData) {
            userData.onSettleData(user);// 结算设置玩家数据
            userData.pokers = user.poker.pokers;
        }
    }
    App.UIManager.emit(Event.AGS_GAME_RESULT, args);
}

/**
 * 退出房间
 */
function onLeaveRoom(){
}

/**
 * 退出房间成功
 */
function onLeaveRoomSuccess(){
    // 创建房间成功之后，切换channel，连接到房间channel
    let selfData = App.UserManager.getSelf();
    if (!selfData){
        return
    }
    App.Socket.switchChannel('lobby');
}

/**
 * 别人退出房间
 */
function onOtherLeaveRoom(args){
    let position  = args.position;
    App.UIManager.emit(Event.AGS_OTHER_LEAVE,position);
}

/**
 * 断线重连
 */
function onReconnect(args){
    let sceneName = cc.director.getScene().name;
    App.UserManager.setRoom(args.roomInfo);
    let room = App.UserManager.getRoom();
    let roomInfo = args.roomInfo;
    if (!room){
        return;
    }
    room.chips = roomInfo.chips.reverse();
    if (args.gameStatus == 1){
        room.status = ROOM_STATUS.FIRST_BEGIN;// 房间状态，默认为第一次进入
    } else if (args.gameStatus == 2) {
        room.status = ROOM_STATUS.GAMING;
        room.actions = args.actions;
    } else if (args.gameStatus == 3){
        room.status = ROOM_STATUS.READY;
    }
    // 设置自己的信息
    var userInfo = args.userInfo;
    var selfData = App.UserManager.setSelf(userInfo);
    selfData.setPlayerInfo(userInfo);
    // 其他人都数据
    for (var i = 0; i < roomInfo.users.length; i ++){
        let user = roomInfo.users[i];
        if (user){
            if (user.position != selfData.position) {
                let userData = App.UserManager.setOtherUser(user);
                userData.setPlayerInfo(user);
            }
        }
    }
    
    if (sceneName != "game"){
        room.isReconnect = 1;
        cc.director.loadScene("game");
    } else {
        room.isReconnect = 2;
        App.UIManager.emit("reconnect");
    }
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
    'onActionInfo': onActionInfo,// 用户可以选择的操作信息
    'onKanPai': onKanPai,// 自己看牌
    'onOtherKanPai': onOtherKanPai,// 其他人看牌
    'onYaZhu': onYaZhu,// 自己押注
    'onOtherYaZhu': onOtherYaZhu,// 其他人押注
    'onYaZhuFailed': onYaZhuFailed,// 押注失败
    'onQiPai': onQiPai,// 自己弃牌
    'onOtherQiPai': onOtherQiPai,// 其他人弃牌
    'onGameResult': onGameResult,// 开牌
    'onLeaveRoom': onLeaveRoom,// 退出房间
    'onLeaveRoomSuccess': onLeaveRoomSuccess,// 退出房间成功
    'onOtherLeaveRoom': onOtherLeaveRoom,// 别人退出房间
    'onReconnect': onReconnect,// 断线重连
}

