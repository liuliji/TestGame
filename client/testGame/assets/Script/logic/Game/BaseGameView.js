/************************************************************************
 * Copyright (c) 2017 App
 * Author    : liji.liu
 * Mail        : liuliji1184899343@163.com
 * Date        : 2018-03-23
 * Use      : gameview基类
 ************************************************************************/

var App = require('App');
var UIWindow = require('UIWindow');
var enWinType = require('UIWindowDef').enWinType;
var enViewType = require('Consts').enViewType;
var enWinShowType = require('UIWindowDef').enWinShowType;

var LobbySendMsgs = require('LobbySendMsgs');
var Player = require('Player');

cc.Class({
    extends: UIWindow,

    properties: {
        roomIdLabel: cc.Label,// 房间ID的label
        playerAry:{// player数组
            type: Player,
            default:[],
        }
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        if (App.Init()) { // 初始化控制器
        }
        this.baseGameInit();
        this.baseInitPlayer();

    },
    //< 初始化窗口
    onInit: function () {
        // 注册ID
        this.windowID = enViewType.GameUI;
        // 设置窗口类型
        this.windowType = enWinType.WT_Normal;
        // 弹出方式
        this.showType = enWinShowType.WST_HideOther;
        this._super();
    },
    // 游戏初始化
    baseGameInit: function () {
        this.playerMgr = {}; //< 玩家管理器
        this.userPosition = 0;
    },

    // 初始化player节点，并进行相关的操作
    baseInitPlayer: function () {
        var selfData = App.UserManager.getSelf();
        if (!selfData){
            Log.debug('baseInitPlayer————进行初始化player节点时，无法获取到当前玩家信息');
            return;
        }
        var position = selfData.position;
        for (var i = 0, count = this.playerAry.length; i < count; ++i) {
            this.playerAry[i].position = position;
            this.playerAry[i].removePlayer();
            this.playerMgr[position] = this.playerAry[i];
            position++;
            if (position >= count) {
                position = 0;
            }
        }
        // 初始化自己信息
        this.playerAry[0].setPlayerInfo(selfData, true);
    },

    // 动态获取控件
    getNodes: function () {

    },




    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
