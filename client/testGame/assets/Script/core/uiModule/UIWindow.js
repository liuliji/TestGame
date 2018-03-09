/************************************************************************
 * Copyright (c) 2016 App
 * Author       : Shao
 * Mail         : yi-shaoye@163.com
 * Date         : 2016-11-26
 * Use          : UI管理系统-窗口基类
 ************************************************************************/
var enWinType = require('UIWindowDef').enWinType;
var enWinShowType = require('UIWindowDef').enWinShowType;

module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        // 当前界面ID
        windowID: {
            default: 0,
            visible: false
        },
        // 窗口分类
        windowType: {
            default: enWinType.WT_PopUp,
            visible: false
        },
        // 窗口弹出类型
        showType: {
            default: enWinShowType.WST_None,//WST_None,WST_HideOther 关闭其他
            visible: false
        },
        // 底板
        _base: {
            type: cc.Sprite,
            default: null,
            visible: true
        },
        // 底板
        _panel: {
            type: cc.Sprite,
            default: null,
            visible: true
        },
        // 返回
        _back: {
            type: cc.Button,
            default: null,
            visible: true
        },
        // 关闭
        _close: {
            type: cc.Button,
            default: null,
            visible: true
        },
        // 是否初始化
        _bIsLoad: false,
    },

    /**
     * 初始化窗口
     */
    onInit: function () {
        var App = sgm.getSceneApp();
        if (!App) {
            Log.error('UIWindowOnInit-App没有指定当前游戏，没有调用 GlobalData.setAppType');
            return;
        }
        // 加入窗口管理器
        App.UIManager.addWindowInControl(this);
        // 初始化显示状态
        if (this.node.active) {
            this.showWindow();
        } else {
            this.hideWindow();
        }
    },

    // onHide: function () {
    //
    // },

    // use this for initialization
    onLoad: function () {
        // 特殊按钮事件
        if (this._base) {
            this._base.node.on(cc.Node.EventType.TOUCH_END, function () {
            }, this);
        }
        if (this._panel) {
            this._panel.node.on(cc.Node.EventType.TOUCH_END, this.closeCallback, this);
        }
        if (this._close) {
            this._close.node.on(cc.Node.EventType.TOUCH_END, this.closeCallback, this);
        }
        if (this._back) {
            this._back.node.on(cc.Node.EventType.TOUCH_END, this.backCallback, this);
        }
        this._bIsLoad = true;
    },

    /**
     * 显示窗口
     */
    showWindow: function () {
        if (!this.node.active) {
            this.node.active = true;
        }
    },

    /**
     * 隐藏窗口
     */
    hideWindow: function () {
        if (this.node.active) {
            this.node.active = false;
        }
    },
    /**
     * 窗口是否显示
     * @returns {boolean}
     */
    getIsShowWindow: function () {
        if (this.node.active) {
            return true;
        }
        return false;
    },
    /**
     * 关闭按钮事件
     */
    closeCallback: function () {
        var App = sgm.getSceneApp();
        if (!App) {
            Log.error('closeCallback-App 关闭按钮事件，没有调用 GlobalData.setAppType');
            return;
        }
        App.UIManager.hideWindow(this.windowID);
    },
    /**
     * 返回按钮事件
     */
    backCallback: function () {
        var App = sgm.getSceneApp();
        if (!App) {
            Log.error('backCallback-App 返回按钮事件，没有调用 GlobalData.setAppType');
            return;
        }
        App.UIManager.hideWindow(this.windowID);
    }
});
