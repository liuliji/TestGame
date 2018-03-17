/************************************************************************
 * Copyright (c) 2017 App
 * Author    : liji.liu
 * Mail        : liuliji1184899343@163.com
 * Date        : 2018-03-15
 * Use      : loginGM场景的主视图
 ************************************************************************/

var App = require('App');
var UIWindow = require('UIWindow');
var enWinType = require('UIWindowDef').enWinType;
var enViewType = require('Consts').enViewType;
var enWinShowType = require('UIWindowDef').enWinShowType;


cc.Class({
    extends: UIWindow,

    properties: {
        idEditBox: cc.EditBox,// ID文本输入框
    },


    // use this for initialization
    onLoad: function () {
        // 注册ID
        this.windowID = enViewType.LoginUI;
        // 设置窗口类型
        this.windowType = enWinType.WT_Normal;
        // 弹出方式
        this.showType = enWinShowType.WST_HideOther;
        this._super();
    },

    onLogin: function () {
        if (this.idEditBox){
            var uid = this.idEditBox.string;
            if (uid) {
                App.Socket.connect(uid,'_hall',this.onLoginSuccess.bind(this));
            }

        }
    },

    /**
     *
     * @param msg
     */
    onLoginSuccess: function (msg) {
        cc.director.loadScene('lobby');
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
