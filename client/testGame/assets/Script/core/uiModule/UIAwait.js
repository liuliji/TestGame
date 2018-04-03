/************************************************************************
 * Copyright (c) 2016 App
 * Author    : Shao
 * Mail        : yi-shaoye@163.com
 * Date        : 2016-11-26
 * Use      : Await控件
 ************************************************************************/
var UIWindow = require('UIWindow');
var enWinType = require('UIWindowDef').enWinType;
var enCommonUI = require('UIWindowDef').enCommonUI;

cc.Class({
    extends: UIWindow,

    properties: {
        // 文本控件
        message: {
            type: cc.RichText,
            default: null
        },

        animaton:cc.Sprite,

        _isTimeOpen:false,
        _timeData:0,
        _startTimeNow:null,
        _callFunction:null,
    },
    /**
     * 初始化窗口
     */
    onInit: function () {
        // 注册ID
        this.windowID = enCommonUI.AwaitUI;
        // 设置窗口类型
        this.windowType = enWinType.WT_Tips;
        this._super();
    },
    onLoad: function () {
        this._super();
        this.setAwaitTimie(0,false);
    },

    /**
     *  播放动画
     * @param animate 动画
     */
    setImageAnimation: function (animate) {
        let animaton = this.animaton.getComponent(cc.Animation);
        animaton.addClip(animate);
        animaton.play(animate.name);
    },

    /**
     * 设置显示消息
     */
    setMessage: function (msg) {
        this.message.string = msg || '';
    },
    setPosition:function (p) {
        if(this.animaton){
            this.animaton.node.setPosition(p);
        }
    },
    setBackFunction:function (vCF) {
        this._callFunction=vCF;
    },

    /**
     * 显示窗口
     */
    showWindow: function () {
        this._super();
        this.setAwaitTimie(10,true);
    },
    /**
     * 隐藏窗口
     */
    hideWindow: function () {
        this._super();
        this.setAwaitTimie(0,false);
    },

    recordTime: function () {
        if (!this._isTimeOpen) {
            return;
        }
        let endTime = Date.now();
        let jTime = (endTime - this._startTimeNow) / 1000;
        jTime = Math.floor(jTime);
        if (this._timeData - jTime > 0) {
            // Log.debug('时间：' + jTime + ' ' + (this._timeData - jTime));
        } else {
            // Log.debug('---结束转圈时间');
            this._isTimeOpen = false;
            this.node.active=false;

            if(this._callFunction){
                this._callFunction();
            }
        }
    },
    setAwaitTimie: function (timeData=0,isValue=true) {
        // Log.debug('---刷新转圈时间:'+timeData);
        this._isTimeOpen = isValue;
        this._timeData = timeData;
        this._startTimeNow = Date.now();
    },
    update: function (dt) {
       // this.recordTime();
    },
});
