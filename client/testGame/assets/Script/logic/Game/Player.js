/************************************************************************
 * Copyright (c) 2017 App
 * Author    : liji.liu
 * Mail        : liuliji1184899343@163.com
 * Date        : 2018-03-23
 * Use      : player脚本
 ************************************************************************/

var App = require('App');
var BasePlayer = require('BasePlayer');
cc.Class({
    extends: BasePlayer,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this._super();
    },

    // 隐藏不需要的节点
    removePlayer: function () {
        this._super();
        this.node.active = false;
    },
    setPlayerInfo: function (userData) {
        this.node.active = true;

    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
