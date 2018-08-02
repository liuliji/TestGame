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
var RoomSendMsgs = require('RoomSendMsgs');

cc.Class({
    extends: BaseGameView,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this._super();
        App.MsgDispatcher.setCanProcessMsg(false);
        this.gameInit();
    },

    gameInit: function () {
        // 数据初始化
        this.initValue();
        // 先动态获取当前页面的所有控件
        this.getNodes();
        // 基本的初始化操作
        this.basicInit();
        // 注册事件监听
        this.gameEventRegist();
    },

    // 数据初始化
    initValue: function () {
        this.operateOffset = 100;// 操作面板的偏移量
    },

    basicInit: function () {
        // 显示房间号
        if (this.roomIdLabel) {
            var roomObj = App.UserManager.getRoom();
            if (roomObj) {
                this.roomIdLabel.string = roomObj.roomId;
            }
        }
        var selfData = App.UserManager.getSelf();
        if (!selfData) {
            return;
        }
        if (!selfData.roomOwner && !selfData.readyStatus) {
            this.setReadyIsShow(true);
        } else {
            this.setReadyIsShow(false);
        }
    },

    // 游戏时间注册
    gameEventRegist: function () {
        this.node.on(Event.AGS_JOIN_ROOM, this.onPlayerJoin.bind(this));
        this.node.on(Event.AGS_TALK, this.onPlayerTalk.bind(this));
        this.node.on(Event.AGS_READY, this.onPlayerReady.bind(this));
        this.node.on(Event.AGS_FAPAI, this.onFaPai.bind(this));
        this.node.on(Event.AGS_ACTION_INFO, this.onActionInfo.bind(this));
        this.node.on(Event.AGS_HIDE_OPERATE, this.onHideOperate.bind(this));
    },

    // 动态获取控件
    getNodes: function () {
        // debugger;
        // 开始游戏按钮
        this.btnStart = null;
        var btnStart = sgm.MethodsUtils.getNodeChildObject(this.node, 'bottomLayer?btnStart');
        if (btnStart) {
            this.btnStart = btnStart;
        }
        // 准备按钮
        this.btnReady = null;
        var btnReady = sgm.MethodsUtils.getNodeChildObject(this.node, 'bottomLayer?btnReady');
        if (btnReady) {
            this.btnReady = btnReady;
        }
        // 操作面板
        this.operateLayer = null;
        var operateLayer = sgm.MethodsUtils.getNodeChildObject(this.node, 'operateLayer');
        if (operateLayer) {
            this.operateLayer = operateLayer;
            var winSize = cc.director.getWinSize();
            var winHeight = winSize.height;
            var height = this.operateLayer.height;
            this.operateLayer.setPositionY(- winHeight / 2 - height / 2 - this.operateOffset);

        }
        // 操作面板上的按钮
        this.buttonWatch = null;// 看牌
        var buttonWatch = sgm.MethodsUtils.getNodeChildObject(this.node, 'operateLayer?layout?buttonWatch', cc.Button);
        if (buttonWatch) {
            this.buttonWatch = buttonWatch;
        }
        this.buttonBet = null;// 押注
        var buttonBet = sgm.MethodsUtils.getNodeChildObject(this.node, 'operateLayer?layout?buttonBet', cc.Button);
        if (buttonBet) {
            this.buttonBet = buttonBet;
        }
        this.buttonGiveUp = null;// 扣牌
        var buttonGiveUp = sgm.MethodsUtils.getNodeChildObject(this.node, 'operateLayer?layout?buttonGiveUp', cc.Button);
        if (buttonGiveUp) {
            this.buttonGiveUp = buttonGiveUp;
        }
        this.buttonOpen = null;// 开牌
        var buttonOpen = sgm.MethodsUtils.getNodeChildObject(this.node, 'operateLayer?layout?buttonOpen', cc.Button);
        if (buttonOpen) {
            this.buttonOpen = buttonOpen;
            // this.buttonOpen.interactable = false;
        }

    },

    // 准备
    onReady: function () {
        this.setReadyIsShow(false);
        RoomSendMsgs.onReady();
    },

    // 开始
    onStart: function () {
        RoomSendMsgs.onStartGame();
    },

    setReadyIsShow: function (isShow) {
        if (this.btnReady) {
            this.btnReady.active = isShow;
        }
    },

    // 玩家加入房间
    onPlayerJoin: function (event) {
        var userData = event.detail;
        Log.debug('玩家加入房间：' + JSON.stringify(userData));
        if (!userData) {
            return;
        }
        // 初始化自己信息
        this.playerAry[userData.position].setPlayerInfo(userData, true);
        /**
         * 如果有人准备了，这个时候，又有人进入房间的话，那么房主的准备按钮就需要隐藏掉，
         * 这里使用统一的逻辑进行处理，判断玩家是否都准备了，同时，根据房间的状态、是否是第一局
         * 等信息进行判断，直接对开始和准备按钮进行显示和隐藏
         */
        this.isAllReady();
    },

    // 玩家说话
    onPlayerTalk: function (event) {
        var args = event.detail;
        Log.debug('玩家加入房间：' + JSON.stringify(args));
    },

    /**
     * 玩家点击准备按钮
     */
    onPlayerReady: function (event) {
        // debugger;
        var position = event.detail;
        var userData = App.UserManager.getAllUserData(position);
        if (userData) {// 设置玩家已准备

            this.playerAry[position].setPlayerReady(userData.readyStatus);

        }
        this.isAllReady();
        Log.debug('有玩家点击了准备按钮');
    },

    /**
     * 发牌消息
     */
    onFaPai: function () {
        this.btnStart.active = false;
        this.btnReady.active = false;
        App.UserManager.foreachAllUser(function (userData) {
            if (userData) {
                // 给玩家发牌
                var position = userData.position;
                var player = this.playerMgr[position];
                if (player) {
                    player.sendCard(userData.pokers);
                    // 隐藏已准备图标
                    player.setPlayerReady(false)
                }
            }
        }.bind(this));
    },

    /**
     * 玩家操作信息
     */
    onActionInfo: function (event) {
        var args = event.detail;
        var actions = args.actions;
        var position = args.position;

        var actionAry = [];
        // 开始遍历，处理玩家可以进行那些操作
        for (var i = 0; i < actions.length; i++) {
            actionAry.push(actions[i].aId);
        }

        // 看牌
        if (this.inArray(actionAry, 1)) {
            this.buttonWatch.interactable = true;
        } else {
            this.buttonWatch.interactable = false;
        }

        // 押注
        if (this.inArray(actionAry, 2)) {
            this.buttonBet.interactable = true;
        } else {
            this.buttonBet.interactable = false;
        }

        // 扣牌
        if (this.inArray(actionAry, 3)) {
            this.buttonGiveUp.interactable = true;
        } else {
            this.buttonGiveUp.interactable = false;
        }

        // 开牌
        if (this.inArray(actionAry, 4)) {
            this.buttonOpen.interactable = true;
        } else {
            this.buttonOpen.interactable = false;
        }

        var actionPositions = args.actionPositions;
        var selfData = App.UserManager.getSelf();
        if (selfData) {
            if (selfData.position == actionPositions) {
                this.moveUpOperateLayer();
            }
        } else {
            this.moveDownOperateLayer();
        }


    },

    // 操作面板移动
    moveUpOperateLayer: function () {
        var winSize = cc.director.getWinSize();
        var winHeight = winSize.height;
        var height = this.operateLayer.height;

        this.operateLayer.stopAllActions();
        // this.operateLayer.setPositionY(- winHeight / 2 - height / 2 - this.operateOffset);

        var mov1 = cc.moveTo(0.5, new cc.Vec2(0, - winHeight / 2 + height / 2));
        var calF = cc.callFunc(function () {
            this.operateLayer.setPosition(new cc.Vec2(0, - winHeight / 2 + height / 2));
        }, this);

        var seq = cc.sequence(mov1, calF);
        this.operateLayer.runAction(seq);
    },

    // 操作面板移出
    moveDownOperateLayer: function () {
        var winSize = cc.director.getWinSize();
        var winHeight = winSize.height;
        var height = this.operateLayer.height;

        this.operateLayer.stopAllActions();
        this.operateLayer.setPositionY(- winHeight / 2 + height / 2);

        var mov1 = cc.moveTo(0.5, new cc.Vec2(0, - winHeight / 2 - height / 2 - this.operateOffset));
        var calF = cc.callFunc(function () {
            this.operateLayer.setPosition(new cc.Vec2(0, - winHeight / 2 - height / 2 - this.operateOffset));
        }, this);

        var seq = cc.sequence(mov1, calF);
        this.operateLayer.runAction(seq);
    },

    //判断数组中是否存在某个变量
    inArray: function (array, value) {
        for (var i = 0; i < array.length; i++) {

            if (array[i] == value) {

                return true;

            }

        } return false;
    },

    /**
     * 判断是否所有的玩家都已经准备好了
     */
    isAllReady: function () {
        var allReady = true;
        var selfData = App.UserManager.getSelf();
        if (selfData && selfData.roomOwner) {
            App.UserManager.foreachOtherUser(function (userData) {
                if (userData) {
                    if (userData.readyStatus == false) {
                        allReady = false;
                    }
                }
            }.bind(this));
        }
        if (selfData && selfData.roomOwner) {// 自己如果是房主的话
            if (allReady) {
                this.btnStart.active = true;
            } else {
                this.btnStart.active = false;
            }
        } else {// 自己不是房主的话
            if (selfData.readyStatus == true) {// 自己已经准备了，就全都隐藏
                this.btnStart.active = false;
                this.btnReady.active = false;
            } else {// 自己还么准备就只显示准备按钮
                this.btnStart.active = false;
                this.btnReady.active = true;
            }

        }

    },

    /**
     * 菜单按钮事件
     */
    onGameMenu: function () {
        App.UIManager.showWindow(enViewType.GameMenuUI);
    },

    // 看牌
    onWatch: function () {
        this.buttonWatch.interactable = false;
        RoomSendMsgs.onActionExecute(1);
        // this.moveDownOperateLayer();
    },

    // 押注
    onBet: function () {
        App.UIManager.showWindow(enViewType.BetUI);
    },

    // 扣牌
    onGiveUp: function () {
        RoomSendMsgs.onActionExecute(3);
        this.moveDownOperateLayer();
    },

    // 开牌
    onOpen: function () {
        RoomSendMsgs.onActionExecute(4);
        this.moveDownOperateLayer();
    },

    // 隐藏操作面板
    onHideOperate: function () {
        this.moveDownOperateLayer();
    },

    // 测试按钮
    testButton: function () {
        var selfData = App.UserManager.getSelf();
        if (!selfData) {
            return;
        }
        var selfPlayer = this.playerMgr[selfData.position];
        if (!selfPlayer) {
            return;
        }
        selfPlayer.watchCard([1, 2, 3]);
    },

    update: function (dt) {
        App.MsgDispatcher.processMessage(this);
    },
});
