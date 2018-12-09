/************************************************************************
 * Copyright (c) 2016 App
 * Author    : liji.liu
 * Mail      : liuliji1184899343@163.com
 * Date      : 2018-03-19
 * Use       : Socket注册回调
 ************************************************************************/
var App = require('App');
var enMsgType = require('UIWindowDef').enMsgType;
var LobbySendMsgs = require('LobbySendMsgs');
var RoomSendMsgs = require('RoomSendMsgs');


/**
 * 注册回调函数
 */
function registerHandler() {
    // 创建socket连接成功
    App.Socket.registerEventListener('socket_success',onConnectSuccess);
    // 创建socket连接失败
    App.Socket.registerEventListener('socket_error',onConnectError);
    // 断开socket连接
    App.Socket.registerEventListener('socket_close',onConnectClose);
    // 加入channel成功
    App.Socket.registerEventListener('join_success',onJoinSuccess);
    // 加入channel失败
    App.Socket.registerEventListener('join_error',onJoinError);
    // 加入channel超时
    App.Socket.registerEventListener('join_timeout',onJoinTimeout);
};

/**
 * 建立socket成功
 */
function onConnectSuccess(channel,msg) {
    if (msg){

    } else {
        App.Socket.switchChannel(channel);
    }
}

/**
 * 建立socket失败
 * @param msg 失败返回的消息
 */
function onConnectError(msg) {

}

/**
 * socket断开
 */
function onConnectClose() {

}

/**
 * 加入channel成功
 * @param msg 成功返回的消息
 */
function onJoinSuccess(msg,channel) {
    // debugger;
    if (msg.roomId){
        if (msg.roomId == "lobby" || msg.roomId == "" || !msg.roomId){
            if (channel == 'lobby'){
                cc.director.loadScene('lobby');
            }
        } else {
            App.Socket.switchChannel('room:' + roomId);
        }
    } else{
        
    }
    
}

/**
 * 加入channel失败
 * @param msg 失败原因
 */
function onJoinError(msg) {

}

/**
 * 加入channel超时
 * @param channel 要加入的channel
 */
function onJoinTimeout(channel) {

}



// /**
//  * 创建连接成功回调
//  */
// function onConnectComplete(error) {
//     Log.warn('---------创建连接成功回调Ddz-- connect type:' + App.Socket.type);
//     App.UIManager.showAwait();
// };
//
// /**
//  * 创建连接失败回调
//  */
// function onConnectError(error) {
//     Log.debug('---------创建连接失败回调---------');
//     App.UIManager.hideAwait();
//     App.UIManager.showMessageBox('连接服务器失败!', enMsgType.None, function () {
//         App.UIManager.showAwait();
//     });
// };

// /**
//  * 断开连接回调
//  */
// function onDisconnect(error) {
//     Log.debug('---------断开连接回调-------');
//     if (error) {
//         var vErr = JSON.stringify(error);
//         Log.debug('---现:' + vErr + ' 原:' + error);
//     }
//     var vRoomData = App.UserManager.getRoom();
//     if (vRoomData) {
//         if (vRoomData.isPlayBack) {//回放的话就不处理断线的问题了
//             Log.debug('----------回放的话就不处A理断线的问题了----------');
//             return;
//         }
//     }
//
//     // Log.debug('disconnect' + error);
//     // App.UIManager.hideAwait();
//     App.UIManager.showAwait("与服务器断开链接!");
//     // App.UIManager.showMessageBox('与服务器断开链接!', enMsgType.None, function () {
//     //     App.UIManager.showAwait();
//     // });
// };
//
// /**
//  * 断线重连成功回调
//  */
// function onReconnectComplete(error) {
//     Log.debug('---------断线重连成功回调:' + App.Socket.type);
//
//     var vRoomData = App.UserManager.getRoom();
//     if (vRoomData) {
//         if (vRoomData.isPlayBack) {//回放的话就不处理断线的问题了
//             Log.debug('----------回放的话就不处理断线的问题了----------');
//             return;
//         }
//     }
//     if (App.Socket.type == 1) {
//         LobbySendMsgs.onLoginLobby();//向大厅服务器请求
//     } else {
//         RoomSendMsgs.onLoginRoom();
//     }
// };



/**
 * 导出函数列表
 */
module.exports = {
    'registerHandler': registerHandler, // 注册socket回调函数
};