/************************************************************************
 * Copyright (c) 2018 testGame
 * Author    : liji.liu
 * Mail      : liuliji1184899343@163.com
 * Date      : 2017-3-16
 * Use       : Login场景管理
 ************************************************************************/

var App = require('App');

cc.Class({
    extends: cc.Component,

    properties: {


    },

    // use this for initialization
    onLoad: function () {
        if (App.Init()) { // 初始化控制器
        }
        App.UIManager.showAwait();
    },

});
