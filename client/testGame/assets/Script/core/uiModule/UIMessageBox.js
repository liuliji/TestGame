/************************************************************************
 * Copyright (c) 2016 App
 * Author    : Shao
 * Mail        : yi-shaoye@163.com
 * Date        : 2016-11-26
 * Use      : MessageBox控件
 ************************************************************************/
var App = require('App');
var UIWindow = require('UIWindow');
var enWinType = require('UIWindowDef').enWinType;
var enCommonUI = require('UIWindowDef').enCommonUI;
var enMsgType = require('UIWindowDef').enMsgType;

cc.Class({
    extends: UIWindow,

    properties: {
        message: {//文本控件
            type: cc.RichText,
            default: null
        },
        confirm: {   // 确定按钮
            type: cc.Button,
            default: null
        },
        callOff: {   // 取消按钮
            type: cc.Button,
            default: null
        },
        confirmStr: { // 取消按钮文字
            type: cc.RichText,
            default: null
        },
        cancelStr: { // 取消按钮文字
            type: cc.RichText,
            default: null
        },
        _confirmCallback:null,//确定回调
        _cancelCallback:null, //取消回调
    },

    /**
     * 初始化窗口
     */
    onInit: function () {
        // 注册ID
        this.windowID = enCommonUI.MessageBoxUI;
        // 设置窗口类型
        this.windowType = enWinType.WT_Tips;

        this._super();
    },

    /**
     * 设置显示消息
     * @param msg 消息
     * @param type 按钮位置 None 0 , Message 100
     * @param confirm 按钮A 确定按钮回调
     * @param cancel  按钮B 按钮回调
     * @param confirmStr 按钮A文字 废弃了
     * @param cancelStr  按钮B文字 废弃了
     */
    setMessage: function (msg, type, confirm, cancel, confirmStr, cancelStr) {
        // 显示文本
        this.message.string = msg;
        // 显示按钮
        switch (type) {
            case enMsgType.None: {
                this.confirm.node.x = 0;
                if(this.callOff){
                    this.callOff.node.active=false;
                }
                // this._close.node.active = false;
            }
                break;
            case enMsgType.Message: {
                this.confirm.node.x = 100;
                // this._close.node.active = true;
                if(this.callOff){
                    this.callOff.node.active=true;
                }
            }
                break;
        }
        Log.debug('\t\t设置显示消息:显示的类型:'+type);

        // 注册回调
        this._confirmCallback = confirm;//确定按钮回调
        this._cancelCallback = cancel;
        // 按钮文本
        // this.confirmStr.string = confirmStr || '确定';
        // this.cancelStr.string = cancelStr || '取消';
    },
    /**
     * 确定按钮事件
     */
    onConfirmCallback() {
        this.hideWindow();
        // Log.debug('\t\t\t显示MessageBox 确定按钮事件');
        if (this._confirmCallback) {
            this._confirmCallback();
        }else{
            // Log.error('确定按钮事件 没有对象');
        }
    },
    /**
     * 关闭按钮事件
     */
    closeCallback() {
        this.hideWindow();
        // Log.debug('\t\t\t显示MessageBox 关闭按钮事件');
        if (this._cancelCallback) {
            this._cancelCallback();
        }else{
            // Log.error('关闭按钮事件 没有对象');
        }
    }
});
