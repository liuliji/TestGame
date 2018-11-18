/************************************************************************
 * Copyright (c) 2017 App
 * Author    : liji.liu
 * Mail        : liuliji1184899343@163.com
 * Date        : 2018-03-23
 * Use      : 房间内菜单
 ************************************************************************/

var App = require('App');
var UIWindow = require('UIWindow');
var enWinType = require('UIWindowDef').enWinType;
var enViewType = require('Consts').enViewType;
var enWinShowType = require('UIWindowDef').enWinShowType;
var RoomSendMsgs = require('RoomSendMsgs');
var enMsgType = require('UIWindowDef').enMsgType;
var ROOM_STATUS = require('Consts').ROOM_STATUS;// 房间状态

cc.Class({
    extends: UIWindow,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this._super();

        this.getNodes();
    },
    //< 初始化窗口
    onInit: function () {
        // 注册ID
        this.windowID = enViewType.GameMenuUI;
        // 设置窗口类型
        this.windowType = enWinType.WT_Normal;
        // 弹出方式
        this.showType = enWinShowType.WST_None;
        this._super();
    },
    showWindow: function () {
        this._super();
        // this.setUpgroupOrLeaveShown();
        var selfData = App.UserManager.getSelf();
        if (!selfData){
            return;
        }
        let room = App.UserManager.getRoom();
        let status = room.status;
        if (selfData.roomOwner){// 是房主
            this.setUpgroupIsShow(true);
            this.setLeaveIsShow(false);
        } else {// 不是房主
            if (status == ROOM_STATUS.FIRST_BEGIN){
                this.setUpgroupIsShow(false);
                this.setLeaveIsShow(true);
            } else {
                this.setUpgroupIsShow(true);
                this.setLeaveIsShow(false);
            }
        }
    },

    // 动态获取控件
    getNodes: function () {
        // 菜单按钮
        this.btnMenu = null;
        var btnMenu = sgm.MethodsUtils.getNodeChildObject(this.node,'bg_yc?menuNode?btnMenu');
        if (btnMenu){
            this.btnMenu = btnMenu;
        }
        // 设置按钮
        this.btnSet = null;
        var btnSet = sgm.MethodsUtils.getNodeChildObject(this.node,'bg_yc?menuNode?btnSet');
        if (btnSet){
            this.btnSet = btnSet;
        }
        // 游戏规则按钮
        this.btnRule = null;
        var btnRule = sgm.MethodsUtils.getNodeChildObject(this.node,'bg_yc?menuNode?btnRule');
        if (btnRule){
            this.btnRule = btnRule;
        }
        // 解散按钮
        this.btnUpgroup = null;
        var btnUpgroup = sgm.MethodsUtils.getNodeChildObject(this.node,'bg_yc?menuNode?btnUpgroup');
        if (btnUpgroup){
            this.btnUpgroup = btnUpgroup;
        }
        // 退出按钮
        this.btnLeave = null;
        var btnLeave = sgm.MethodsUtils.getNodeChildObject(this.node,'bg_yc?menuNode?btnLeave');
        if (btnLeave){
            this.btnLeave = btnLeave;
        }
    },

    // 设置解散按钮的显示和隐藏
    setUpgroupIsShow: function (isShow) {
        if (this.btnUpgroup){
            this.btnUpgroup.active = isShow;
        }
    },

    // 退出按钮的显示和隐藏
    setLeaveIsShow: function (isShow) {
        if (this.btnLeave){
            this.btnLeave.active = isShow;
        }
    },

    // 设置解散按钮和退出按钮的显示和隐藏、以及是否置灰
    setUpgroupOrLeaveShown: function () {
        App.UIManager.showMessageBox('确定要解散房间吗？',enMsgType.Message,this.onUpgroupConfirm.bind(this),this.onUpgroupCancel.bind(this));
    },
    // 解散确定按钮
    onUpgroupConfirm: function () {
        var roomObj = App.UserManager.getRoom();
        if (!roomObj){
            App.UIManager.hideWindow(this.windowID);
            return;
        }
        let status = roomObj.status;
        let selfData = App.UserManager.getSelf();
        if (!selfData){
            return;
        }
        if (selfData.roomOwner){
            if (status == ROOM_STATUS.FIRST_BEGIN){
                RoomSendMsgs.onDeleteRoom(roomObj.roomId);
            } else {
                // 发起解散
                return;
            }
        } else {
            // 发起解散
            return;
        }
        
    },
    // 取消解散
    onUpgroupCancel: function () {
        // App.UIManager.hideWindow(this.windowID);
    },

    // 打开设置页面
    onSet: function () {
        // 隐藏自己，同时，显示设置页面
        App.UIManager.hideWindow(this.windowID);

    },

    // 打开游戏规则、玩法页面
    onRule: function () {
        // 隐藏自己，同时，显示玩法页面
        App.UIManager.hideWindow(this.windowID);
    },

    // 解散或请求解散
    onUpgroup: function () {
        /**
         * 获取自己的信息和房间信息，判断自己是否有解散的权利；
         * 根据房间数据，判断是否已经开局，如果已经开局，就要发起解散请求
         */
        var selfData = App.UserManager.getSelf();
        if (!selfData){
            Log.debug('菜单页面无法获取自己的数据');
            return;
        }
        var roomObj = App.UserManager.getRoom();
        if (!roomObj){
            Log.debug('菜单页面无法获取房间信息');
            return;
        }
        this.setUpgroupOrLeaveShown();
    },

    // 离开房间
    onLeave: function () {
        var selfData = App.UserManager.getSelf();
        if (!selfData){
            Log.debug('菜单页面无法获取自己的数据');
            return;
        }
        var roomObj = App.UserManager.getRoom();
        if (!roomObj){
            Log.debug('菜单页面无法获取房间信息');
            return;
        }
        RoomSendMsgs.onLeaveRoom();

    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
