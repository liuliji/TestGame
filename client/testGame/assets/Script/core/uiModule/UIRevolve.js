/************************************************************************
 * Copyright (c) 2016 App
 * Author    : Shao
 * Mail        : yi-shaoye@163.com
 * Date        : 2016-11-26
 * Use      : Revolve控件
 ************************************************************************/
var UIWindow = require('UIWindow');
var enWinType = require('UIWindowDef').enWinType;
var enCommonUI = require('UIWindowDef').enCommonUI;

cc.Class({
    extends: UIWindow,

    properties: {
        // 文字
        msg: {
            type: cc.RichText,
            default: null
        },
        background: cc.Sprite,
        // 文本数组
        aryMsg: {
            default: [],
            visible: false
        },
        // 是否运行
        running: {
            default: false,
            visible: false
        },
        _width: 0,
    },
    /**
     * 初始化窗口
     */
    onInit: function () {
        // 注册ID
        this.windowID = enCommonUI.RevolveUI;
        // 设置窗口类型
        this.windowType = enWinType.WT_Normal; // WT_Tips;
        this._super();
    },
    onLoad: function () {
        this._super();
        this.moveTime=0;
    },

    /**
     * 循环
     */
    update: function (dt) {
        // Log.debug("循环" + dt);
        if (this.running) {
            if (this.background) {
                this._width = this.background.node.width;
            }
            this.moveTime = this.moveTime + dt;
            // Log.debug('---循环宽度-->'+this._width);
            this.msg.node.x -= (dt * 80);
            if (this.msg.node.x + this.msg.node.width <= (-this._width * 0.6)) {
                this.running = false;
                this.moveTime=0
                this.checkMsg();
            }
        }
    },
    /**
     * 添加提示信息
     */
    addTips: function (str) {
        this.aryMsg.push(str);
        this.checkMsg();
    },
    /**
     * 检测消息池
     */
    checkMsg: function () {
        // Log.debug("消息长度:"+this.aryMsg.length);
        if (!this.running && this.aryMsg.length) {
            if (this.background) {
                this._width = this.background.node.width;
            }
            var str = this.aryMsg.shift();
            this.msg.string = str;
            this.msg.node.x = (this._width * 0.5);
            this.visible = true;
            this.running = true;
        } else if (!this.running) {
            // this.node.active = false;
            this.hideWindow();
        }
    },

    /**
     * 隐藏窗口
     */
    hideWindow: function () {
        this._super();
        this.clear();
    },

    /**
     * 设置消息堆
     * @param argmsg
     */
    setMsgStack: function (argmsg) {
        if (argmsg instanceof Array) {
            this.aryMsg = [];
            let iCount = argmsg.length;
            for (let i = 0; i < iCount; i++) {
                this.aryMsg.push(argmsg[i]);
            }
        } else {
            Log.error('设置跑马灯数据有问题');
        }
    },
    //获取消息堆
    getMsgStack: function () {
        return this.aryMsg;
    },
    clear: function () {
        this.aryMsg = [];
        this.running = false;
    },

});
