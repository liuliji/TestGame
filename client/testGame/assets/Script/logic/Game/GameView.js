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
        // 先动态获取当前页面的所有控件
        this.getNodes();
        // 基本的初始化操作
        this.gameInit();
        // 注册事件监听
        this.gameEventRegist();
    },

    gameInit: function () {
        // 显示房间号
        if (this.roomIdLabel){
            var roomObj = App.UserManager.getRoom();
            if (roomObj){
                this.roomIdLabel.string = roomObj.roomId;
            }
        }
        var selfData = App.UserManager.getSelf();
        if (!selfData){
            return;
        }
        if (!selfData.roomOwner && !selfData.readyStatus){
            this.setReadyIsShow(true);
        } else {
            this.setReadyIsShow(false);
        }
    },

    // 游戏时间注册
    gameEventRegist: function () {
        this.node.on(Event.AGS_JOIN_ROOM,this.onPlayerJoin.bind(this));
        this.node.on(Event.AGS_TALK,this.onPlayerTalk.bind(this));
    },

    // 动态获取控件
    getNodes: function () {
        debugger;
        // 开始游戏按钮
        this.btnStart = null;
        var btnStart = sgm.MethodsUtils.getNodeChildObject(this.node,'bottomLayer?btnStart');
        if (btnStart){
            this.btnStart = btnStart;
        }
        // 准备按钮
        this.btnReady = null;
        var btnReady = sgm.MethodsUtils.getNodeChildObject(this.node,'bottomLayer?btnReady');
        if (btnReady){
            this.btnReady = btnReady;
        }
    },

    // 准备
    onReady: function () {

    },

    // 开始
    onStart: function () {

    },

    setReadyIsShow: function (isShow) {
        if (this.btnReady){
            this.btnReady.active = isShow;
        }
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
