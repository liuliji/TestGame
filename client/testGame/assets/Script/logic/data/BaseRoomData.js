/************************************************************************
 * Copyright (c) 2017 cardgame
 * Author      : Lee
 * Mail        : crazycode_lee@163.com
 * Date        : 2017-4-16
 * Use         : 房间数据
 ************************************************************************/
var enRoomState = require('Consts').enRoomState;
var BaseRoomData = cc.Class({
    properties: {
        roomId: 0,        //< 房间索引
        type: 0,          //< 进入房间类型
        playTypes: [],    //< 玩法配置
        roomType: 0,      //< 房间类型
        roomGps: false,   //< 是否开启gps
        roomStatus: enRoomState.FIRST_BEGIN, //< 房间状态
        requestUngroup: false, //< 是否有玩家请求了解散房间
        ungroupName: '',       //< 请求解散玩家昵称
        ungroupUid: 0,         //< 请求解散玩家UID
        ungroupTime: '',       //< 请求解散时间
        ungroupArray: [],      //< 玩家同意或不同意数组 [{uid:用户id, agree:同意类型,userName:'用户'},...]
        playCount: 0,          // 第几局
        totalCount: 30,        //\ 总局数
        playerNum: 3,//\ 最大玩家数
        playerAry: [], /* 游戏结束 */
        gameFinsh: false,//是否在结束页面，结束时要进行断网处理
    },
    ctor: function () {},
    setRoomId: function (roomId) {
        this.roomId = roomId; //< 房间索引
    },

    //< 房间基础数据
    setRoomBase: function (room) {
        this.setRoomId(room.roomId || 0);
        this.type = room.type || 0; //< 进入房间类型
    },

    //< 设置房间数据
    setRoomInfo: function (room) {
        this.roomType = room.roomType || 0;
        this.playTypes = room.playTypes || [];
        this.roomGps = room.gps || false;
        this.roomStatus = room.roomStatus || enRoomState.FIRST_BEGIN;
        /* 投票信息 */
        this.requestUngroup = room.requestUngroup || false;
        this.ungroupName = room.ungroupName || '';
        this.ungroupUid = room.ungroupUid || 0;
        this.ungroupTime = room.ungroupTime || 0;
        this.ungroupArray = room.ungroupArray || [];
        this.playCount = room.playCount || 0;
        this.totalCount = room.totalCount || 30;
        this.playerNum = room.playerNum || 3;
    },

    //< 请求解散房间
    onRequestUngroup: function (info) {
        this.requestUngroup = true;
        this.ungroupName = info.ungroupName;
        this.ungroupUid = info.ungroupUid;
        this.ungroupTime = info.ungroupTime;
        this.ungroupArray = info.ungroupArray;
    },

    /**
     * 开始游戏
     * @param info
     */
    startGame: function (info) {
        this.roomStatus = enRoomState.GAMING;
        this.playCount = info.playCount;
        this.totalCount = info.totalCount;
    },

    /**
     * 游戏结束
     */
    gameEnd: function (playerAry) {
        this.playerAry = playerAry;
        this.roomStatus = enRoomState.GAME_OVER;
    },

});
module.exports = BaseRoomData;