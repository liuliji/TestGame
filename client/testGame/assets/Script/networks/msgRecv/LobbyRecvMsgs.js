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
function onEnterRoom(args) {

    App.UIManager.emit('enter_room',args);
}

module.exports = {
    'oncreateRoom': oncreateRoom,// 创建房间
    'onEnterRoom': onEnterRoom,// 加入房间
}

