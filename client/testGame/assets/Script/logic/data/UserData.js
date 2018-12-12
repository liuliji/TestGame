/************************************************************************
 * Copyright (c) 2017 cardgame
 * Author    : Lee
 * Mail        : crazycode_lee@163.com
 * Date        : 2017-4-16
 * Use      : 用户数据
 ************************************************************************/
var BaseUserData = require('BaseUserData');
var UserData = cc.Class({
    name: 'UserData',
    extends: BaseUserData,
    properties: {
        pokers: [],// 玩家手中的牌

        winType: 0,//\ 输赢结果
        curMoney: 0,// 当前的钱数
        deltaMoney: 0,// 当前输赢的钱数

    },

    ctor: function () {
    },

    setUserDataInfo: function (info) {
        this.winType = info.winType || 0;//\ 输赢结果

        if (!(info.isOffline == null || typeof (info.isOffline) == 'undefined')) {
            this.isOffline = info.isOffline;
        } else {
            this.isOffline = false;
        }

    },


    //\ 结束时设置玩家数据
    onSettleData: function (info) {
        this.curMoney = info.curMoney;// 当前的钱数
        this.deltaMoney = info.deltaMoney;// 当前输赢的钱数

    },

    //\ 设置玩家信息
    setPlayerInfo: function (info) {
        this._super(info);
        // this.winType = info.winType || 0;//\ 输赢结果
        // this.score = info.score || 0;
        // this.readyStatus = info.readyStatus || false;
        // // debugger;
        // this.roomOwner = info.roomOwner || false;
        // //玩家基础数据
        // if (info.image) {
        //     this.image = info.image;
        // }
        // this.score = info.score || 0;
        // this.win = info.win || 0;//< 胜利次数
        // this.position = info.position;

        // if (!(info.isOffline == null || typeof (info.isOffline) == 'undefined')) {
        //     this.isOffline = info.isOffline;
        // } else {
        //     this.isOffline = false;
        // }


        this.curMoney = info.curMoney || 0;
        this.online = info.online || false;
        this.position = info.position || 0;
        this.readyStatus = info.readyStatus || false;
        this.roomId = info.roomId || "";
        this.roomOwner = info.roomOwner || false;
        this.uid = info.uid || "";
        this.userName = info.userName || "";
        this.pokers = info.pokers || [0,0,0];

    },

    /**
     * 重置玩家数据
     */
    reset: function () {
        // Log.warn(this.userName+'---重置玩家数据---');
        this.winType = 0;//\ 输赢结果
        this.reconnect = false;
    },

});

module.exports = UserData;