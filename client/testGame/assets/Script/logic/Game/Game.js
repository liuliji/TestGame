/************************************************************************
 * Copyright (c) 2017 App
 * Author    : liji.liu
 * Mail        : liuliji1184899343@163.com
 * Date        : 2018-03-27
 * Use      : 房间canvas节点，进行房间相关的初始化
 ************************************************************************/

var App = require('App');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
        if (App.Init()) { // 初始化控制器

        }
        App.MsgDispatcher.setCanProcessMsg(true);
    },



    update: function (dt) {
        App.MsgDispatcher.processMessage(this);
    },
});
