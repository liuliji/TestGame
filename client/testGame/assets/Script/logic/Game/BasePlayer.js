/************************************************************************
 * Copyright (c) 2017 App
 * Author    : liji.liu
 * Mail        : liuliji1184899343@163.com
 * Date        : 2018-03-23
 * Use      : player脚本
 ************************************************************************/

var App = require('App');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.baseInit();
    },

    start: function () {

    },

    baseInit: function () {
        this.position = -1;// 玩家位置
        this.mySelf = false;// 玩家是否是自己
        this.roomOwner = false;// 玩家是否是房主
    },

    removePlayer: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
