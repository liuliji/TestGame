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
var Event = require('Consts').AgreementEvent;
var Consts = require('Consts');

cc.Class({
    extends: BaseGameView,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.gameInit();
        this.gameEventRegist();
    },

    gameInit: function () {
        if (this.roomIdLabel){
            var roomObj = App.UserManager.getRoom();
            if (roomObj){
                this.roomIdLabel.string = roomObj.roomId;
            }
        }
    },

    // 游戏时间注册
    gameEventRegist: function () {
        this.node.on(Event.AGS_JOIN_ROOM,this.onPlayerJoin.bind(this));
        this.node.on(Event.AGS_TALK,this.onPlayerTalk.bind(this));
    },

    // 玩家加入房间
    onPlayerJoin: function (event) {
        var userData = event.detail;
        Log.debug('玩家加入房间：' + JSON.stringify(userData));
        if (!userData){
            return;
        }
        // 初始化自己信息
        this.playerAry[userData.position].setPlayerInfo(userData, true);
    },

    // 玩家说话
    onPlayerTalk: function (event) {
        var args = event.detail;
        Log.debug('玩家加入房间：' + JSON.stringify(args));
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
