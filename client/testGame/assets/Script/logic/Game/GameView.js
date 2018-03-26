/************************************************************************
 * Copyright (c) 2017 App
 * Author    : liji.liu
 * Mail        : liuliji1184899343@163.com
 * Date        : 2018-03-23
 * Use      : gameview房间的游戏主逻辑
 ************************************************************************/

var App = require('App');
var BaseGameView = require('BaseGameView');
var enViewType = require('Consts').enViewType;

cc.Class({
    extends: BaseGameView,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this._super();

    },

    gameInit: function () {
        if (this.roomIdLabel){
            var roomObj = App.UserManager.getRoom();
            if (roomObj){
                this.roomIdLabel.string = roomObj.roomId;
            }
        }
    },

    /**
     * 菜单按钮事件
     */
    onGameMenu: function () {
        App.UIManager.showWindow(enViewType.GameMenuUI);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
