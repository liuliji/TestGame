/************************************************************************
 * Copyright (c) 2017 App
 * Author    : liji.liu
 * Mail        : liuliji1184899343@163.com
 * Date        : 2018-03-23
 * Use      : 下注面板
 ************************************************************************/

var App = require('App');
var UIWindow = require('UIWindow');
var enWinType = require('UIWindowDef').enWinType;
var enViewType = require('Consts').enViewType;
var enWinShowType = require('UIWindowDef').enWinShowType;
var RoomSendMsgs = require('RoomSendMsgs');
var enMsgType = require('UIWindowDef').enMsgType;
var Event = require('Consts').AgreementEvent;

cc.Class({
    extends: UIWindow,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.gameInit();
    },
    //< 初始化窗口
    onInit: function () {
        // 注册ID
        this.windowID = enViewType.BetUI;
        // 设置窗口类型
        this.windowType = enWinType.WT_Normal;
        // 弹出方式
        this.showType = enWinShowType.WST_None;
        this._super();
    },

    showWindow: function () {
        this._super();
        this.betMoveIn();
    },

    gameInit: function () {
        this.getNodes();
        this.initBet();

    },

    // 动态获取控件
    getNodes: function () {
        // 下注的背景
        this.betBg = null;
        var betBg = sgm.MethodsUtils.getNodeChildObject(this.node, 'bet_bg');
        if (betBg) {
            this.betBg = betBg;
        }
        // 下注按钮
        this.bet1 = null;
        var bet1 = sgm.MethodsUtils.getNodeChildObject(this.node, 'bet_bg?layout?chip1');
        if (bet1) {
            this.bet1 = bet1;
        }
        // 下注按钮
        this.bet2 = null;
        var bet2 = sgm.MethodsUtils.getNodeChildObject(this.node, 'bet_bg?layout?chip2');
        if (bet2) {
            this.bet2 = bet2;
        }
        // 下注按钮
        this.bet3 = null;
        var bet3 = sgm.MethodsUtils.getNodeChildObject(this.node, 'bet_bg?layout?chip3');
        if (bet3) {
            this.bet3 = bet3;
        }
        // 下注按钮
        this.bet4 = null;
        var bet4 = sgm.MethodsUtils.getNodeChildObject(this.node, 'bet_bg?layout?chip4');
        if (bet4) {
            this.bet4 = bet4;
        }
        // 下注label
        this.betLabel = null;
        var betLabel = sgm.MethodsUtils.getNodeChildObject(this.node, 'bet_bg?betLabel', cc.Label);
        if (betLabel) {
            this.betLabel = betLabel;
        }

    },



    // 初始化筹码面板的信息
    initBet: function () {
        var winSize = cc.winSize;
        var betH = this.betBg.height;
        var betW = this.betBg.width;
        this.betBg.setPosition(winSize.width / 2 + betW, - winSize.height / 2 + betH / 2);
        this.betLabel.string = '1';
    },

    // 筹码面板移入视图中
    betMoveIn: function () {
        var winSize = cc.winSize;
        var betH = this.betBg.height;
        var betW = this.betBg.width;
        this.betBg.setPosition(winSize.width / 2 + betW, - winSize.height / 2 + betH / 2);

        //动画
        var mov1 = cc.moveTo(0.5, new cc.Vec2(winSize.width / 2 - betW / 2, - winSize.height / 2 + betH / 2));
        var callF = cc.callFunc(function () {
            this.betBg.setPosition(winSize.width / 2 - betW / 2, - winSize.height / 2 + betH / 2);
        }, this);

        var seq = cc.sequence(mov1, callF);
        this.betBg.stopAllActions();
        this.betBg.runAction(seq);

    },

    // 筹码面板移出视图
    betMoveOut: function () {
        var winSize = cc.winSize;
        var betH = this.betBg.height;
        var betW = this.betBg.width;

        //动画
        var mov1 = cc.moveTo(0.5, new cc.Vec2(winSize.width / 2 + betW, - winSize.height / 2 + betH / 2));
        var callF = cc.callFunc(function () {
            this.betBg.setPosition(winSize.width / 2 + betW, - winSize.height / 2 + betH / 2);
            App.UIManager.hideWindow(this.windowID);
        }, this);

        var seq = cc.sequence(mov1, callF);
        this.betBg.stopAllActions();
        this.betBg.runAction(seq);
    },

    // 下注按钮点击事件
    betOK: function () {
        RoomSendMsgs.onActionExecute(2, parseInt(this.betLabel.string));
        this.betMoveOut();
        App.UIManager.emit(Event.AGS_HIDE_OPERATE);
    },

    // 清空筹码
    betClean: function () {
        this.betLabel.string = '1';
    },

    // 下注按钮点击
    betClick: function (object, value) {
        var button = object.target;
        var sum;
        if (button != this.bet4) {
            var value = parseInt(value);
            var value1 = parseInt(this.betLabel.string);
            sum = value + value1;
            if (sum > 20) {
                sum = 20;
            }
        } else {// 点击了最大
            sum = 20;
        }
        this.betLabel.string = '' + sum;
    }

});
