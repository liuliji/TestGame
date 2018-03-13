/************************************************************************
 * Copyright (c) 2017 App
 * Author	: liji.liu
 * Mail		: liuliji1184899343@163.com
 * Date		: 2018-03-11
 * Use      : 大厅发送消息
 ************************************************************************/

var WSph = require('WSph');

/**
 * 创建房间
 * @param info 房间信息
 */
function oncreateRoom(info) {
    var msg = {};
    WSph.sendMsg('ID_C2S_CREATE_ROOM',msg);
}

/**
 * 删除房间
 * @param info
 */
function onDeleteRoom(room_id) {
    var msg = {
        room_id: room_id,
    };
    WSph.sendMsg('ID_C2S_CREATE_ROOM',msg);
}

/**
 * 加入房间
 * @param roomId 房间ID
 */
function onEnterRoom(roomId) {

}

module.exports = {
    'oncreateRoom': oncreateRoom,// 创建房间
    'onEnterRoom': onEnterRoom,// 加入房间
    'onDeleteRoom': onDeleteRoom,// 删除房间
}


