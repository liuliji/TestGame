/************************************************************************
 * Copyright (c) 2017 cardgame
 * Author    : Lee
 * Mail        : crazycode_lee@163.com
 * Date        : 2017-4-16
 * Use      : 用户基础数据
 ************************************************************************/
var BaseUserData = cc.Class({
    properties: {
        uid: 0, //< 玩家uid
        userName: '',//< 昵称
        sex: 0,//< 性别  0男 1女 -1没有性别
        image: '',//< 头像
        ip: '',//< IP
        cardCount: 0,//< 钻石数
        total: 0,//< 玩的局数
        win: 0,//< 胜利次数
        reconnect: false,//< 重连
        roomOwner: false,   //< 是否是房主
        score: 0,           //< 当前积分
        position: 0,        //< 服务器位置
        longitude: '',      //< 玩家坐标经度
        latitude: '',       //< 玩家坐标纬度
        readyStatus: false, //< 玩家准备状态 没有准备false，准备后trueisOffline = true;    //< 在线状态
    },

    ctor: function () { },

    //< 初始化数据(lobby场景)
    initPlayerInfo: function (player) {
        this.uid = player.uid || 0;
        this.userName = player.userName || '';
        this.sex = player.sex || 0;
        this.image = player.image || '';
        this.ip = player.ip || '';
        this.cardCount = player.cardCount || 0;
        this.total = player.total || 0;
        this.win = player.win || 0;
        this.position = player.position || 0;
    },
    //< 设置房间数据
    setPlayerInfo: function (player) {
        this.roomOwner = player.roomOwner || false;
        // Log.warn('是否是房主A '+this.userName + ' ' + this.roomOwner + ' 原数据:' + info.roomOwner);
        this.score = player.score || 0;
        this.position = player.position || 0;
        this.longitude = player.longitude || '';
        this.latitude = player.latitude || '';
        this.readyStatus = player.readyStatus || false;
        this.isOffline = player.isOffline || true;
    },
});
module.exports = BaseUserData;