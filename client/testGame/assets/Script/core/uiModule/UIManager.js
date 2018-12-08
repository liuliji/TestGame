
/************************************************************************
 * Copyright (c) 2016 App
 * Author    : Shao
 * Mail        : yi-shaoye@163.com
 * Date        : 2016-11-26
 * Use      : UI管理系统-窗口管理
 ************************************************************************/
var App = require('App');
// var PyApp = require('PyApp');
var UIWindow = require('UIWindow');
var enWinType = require('UIWindowDef').enWinType;
var enWinShowType = require('UIWindowDef').enWinShowType;
var enCommonUI = require('UIWindowDef').enCommonUI;
var enMsgType = require('UIWindowDef').enMsgType;
var GlobalData = require('GlobalData');

var LayerType = cc.Enum({
    MessageBox: 1,
    Await: 5,//等待(转圈)
    Tips: 10,
    Revole: 100,//跑马灯文字
});

module.exports = cc.Class({
    extends: cc.Component,
    properties: {
        // 窗口实例
        windowAry: {
            type: [UIWindow],
            default: []
        },
        // 窗口列表
        allWindows: {
            type: [UIWindow],
            default: [],
            visible: false
        },
        // 当前显示窗口
        showWindows: {
            type: [UIWindow],
            default: [],
            visible: false
        },
        // 普通窗口层
        UI_Normal: {
            type: cc.Node,
            default: null
        },
        // 固定窗口层
        UI_Fixed: {
            type: cc.Node,
            default: null
        },
        //弹出窗口层
        UI_Popup: {
            type: cc.Node,
            default: null
        },
        //UITips层
        UI_Tips: {
            type: cc.Node,
            default: null
        },
        showLable: cc.Prefab,//临时加的
        // MessageBox预制体
        _MessageBox: {
            default: null,
            type: cc.Prefab,
            displayName: 'MessageBoxPrefab',
            tooltip: 'MessageBox预制体',
            visible: true
        },
        // Await预制体
        _Await: {
            default: null,
            type: cc.Prefab,
            displayName: 'AwaitPrefab',
            tooltip: 'Await预制体',
            visible: true
        },
        // Tips预制体
        _Tips: {
            default: null,
            type: cc.Prefab,
            displayName: 'TipsBoxPrefab',
            tooltip: 'Tips预制体',
            visible: true
        },
        // Revolve预制体
        _Revolve: {
            default: null,
            type: cc.Prefab,
            displayName: 'RevolvePrefab',
            tooltip: 'Revolve预制体',
            visible: true
        },
        // 是否初始化成功
        _Init: {
            default: false,
            visible: false
        },
        _InitCallback: {
            default: [],
            visible: false
        },
        isEmitEvent: true,
    },

    initAppUIManager: function(){
        App.UIManager = this;
        // if (GlobalData.getAppType() == 1){//1斗地主,2 刨幺
        //     App.UIManager = this;
        // } else if (GlobalData.getAppType() == 2){//1斗地主,2 刨幺
        //     PyApp.UIManager = this;
        // } else{
        //     Log.error('App没有指定当前游戏，没有调用 GlobalData.setAppType');
        //     return;
        // }
        // var vvApp = sgm.getSceneApp();
        // if (!vvApp) {
        //     Log.error('initAppUIManager GlobalData.setAppType');
        // }
        // vvApp.UIManager = this;
    },

    // use this for initialization
    onLoad: function () {

        this.initAppUIManager();
        
        this.isEmitEvent = true;

        // 初始化图层
        if (!this.UI_Normal) {//普通窗口层
            this.UI_Normal = new cc.Node();
            this.UI_Normal.name = 'UI_Normal';
            this.UI_Normal.parent = this.node;
            var widget = this.UI_Normal.addComponent(cc.Widget);
            widget.isAlignTop = true;
            widget.top = 0;
            widget.isAlignBottom = true;
            widget.bottom = 0;
            widget.isAlignLeft = true;
            widget.left = 0;
            widget.isAlignRight = true;
            widget.right = 0;
        }
        if (!this.UI_Fixed) {//固定窗口层
            this.UI_Fixed = new cc.Node();
            this.UI_Fixed.name = 'UI_Fixed';
            this.UI_Fixed.parent = this.node;
            var widget = this.UI_Fixed.addComponent(cc.Widget);
            widget.isAlignTop = true;
            widget.top = 0;
            widget.isAlignBottom = true;
            widget.bottom = 0;
            widget.isAlignLeft = true;
            widget.left = 0;
            widget.isAlignRight = true;
            widget.right = 0;
        }
        if (!this.UI_Popup) { //弹出窗口层
            this.UI_Popup = new cc.Node();
            this.UI_Popup.name = 'UI_Popup';
            this.UI_Popup.parent = this.node;
            var widget = this.UI_Popup.addComponent(cc.Widget);
            widget.isAlignTop = true;
            widget.top = 0;
            widget.isAlignBottom = true;
            widget.bottom = 0;
            widget.isAlignLeft = true;
            widget.left = 0;
            widget.isAlignRight = true;
            widget.right = 0;
        }
        if (!this.UI_Tips) { //UITips层
            this.UI_Tips = new cc.Node();
            this.UI_Tips.name = 'UI_Tips';
            this.UI_Tips.parent = this.node;
            var widget = this.UI_Tips.addComponent(cc.Widget);
            widget.isAlignTop = true;
            widget.top = 0;
            widget.isAlignBottom = true;
            widget.bottom = 0;
            widget.isAlignLeft = true;
            widget.left = 0;
            widget.isAlignRight = true;
            widget.right = 0;
        }

        // let text=cc.instantiate(this.showLable);
        // text.getComponent('ShowLable').setLableString('+123456');
        // text.setPosition(cc.v2(cc.winSize.width*0.25,cc.winSize.height*0.35));
        // this.node.addChild(text);

    },
    // 初始化窗口
    start: function () {
        this.initAppUIManager();
        this.bLayerCount = 1;
        for (var i in this.windowAry) {
            if (this.windowAry[i]) {
                this.windowAry[i].onInit();
            }
        }
        this._Init = true;
        // 初始化回调
        if (this._InitCallback.length > 0) {
            for (var i in this._InitCallback) {
                this._InitCallback[i]();
            }
        }
    },
    /**
     * 检测初始化
     */
    onInit: function (callback) {
        if (this._Init) {
            callback();
        } else {
            this._InitCallback.push(callback);
        }
    },
    /**
     * 添加窗口到管理器
     */
    addWindowInControl: function (baseWindow) {
        if (this.getWindow(baseWindow.windowID)) {
            Log.error('窗口id重复[' + baseWindow.windowID + ']注册!');
            return;
        }
        this.allWindows[baseWindow.windowID] = baseWindow;
        // 获取图层容器
        var layer = this.UI_Normal;//普通窗口
        if (baseWindow.windowType == enWinType.WT_Fixed) {//固定窗口
            layer = this.UI_Fixed;
        } else if (baseWindow.windowType == enWinType.WT_PopUp) {//弹出窗口
            layer = this.UI_Popup;
        } else if (baseWindow.windowType == enWinType.WT_Tips) {//提示窗口
            layer = this.UI_Tips;
        }
        // 设置窗口父节点
        baseWindow.node.parent = layer;
        // 显示控制
        if (baseWindow.node.active) {
            this.showWindow(baseWindow.windowID);
        }
    },
    /**
     * 通过ID获取窗口
     */
    getWindow: function (id) {
        if (this.allWindows && this.allWindows[id]) {
            return this.allWindows[id];
        }
        return null;
    },
    /**
     * 获取显示窗口
     */
    getShowWindow: function (id) {
        if (this.showWindows[id]) {
            return this.showWindows[id];
        } else {
            Log.warn('获取显示窗口[ %d ]无此窗口信息', id);
        }
        return null;
    },
    /**
     * 显示窗口
     */
    showWindow: function (id) {
        var baseWindow = this.getWindow(id);
        if (!baseWindow) {
            Log.warn('[ %d ]无此窗口信息', id);
            return null;
        }

        // 隐藏其他窗口
        if (baseWindow.showType == enWinShowType.WST_HideOther) {
            this.hideAllWindows(id);
        }

        // 记录非固定窗口
        if (baseWindow.windowType != enWinType.WT_Fixed &&
            baseWindow.windowType != enWinType.WT_Tips) {
            this.showWindows[id] = baseWindow;
        }

        // 显示窗口
        baseWindow.showWindow();

        // 调整层级depth
        this.adjustBaseWindowDepth(baseWindow);

        return baseWindow;
    },

    /**
     * 隐藏窗口
     */
    hideWindow: function (id) {
        if (!this.showWindows[id]) {
            Log.warn('[ %d ]无此窗口信息', id);
            return;
        }
        this.showWindows[id].hideWindow();
        this.showWindows[id] = null;
    },
    /**
     * 隐藏全部窗口
     */
    hideAllWindows: function (id) {
        for (var i in this.showWindows) {
            if (i != id) {
                if (this.showWindows[i]) {
                    this.showWindows[i].hideWindow();
                }
            }
        }
        this.showWindows = [];
    },

    hideAllPopWindows: function () {
        for (var i in this.showWindows) {
            if (i != enCommonUI.AwaitUI && this.showWindows[i] && this.showWindows[i].windowType == enWinType.WT_PopUp) {
                this.showWindows[i].hideWindow();
            }
        }
    },
    /**
     * 调整层级depth
     */
    adjustBaseWindowDepth: function (baseWindow) {
        var layer = baseWindow.node.parent;
        if (layer) {
            baseWindow.node.zIndex = ++this.bLayerCount;
        }
    },

    /**
     * 事件派发器
     * @param event 事件
     * @param param 事件参数  function (event) {event.detail
     */
    emit: function (event, param) {
        if (!this.isEmitEvent) {
            return;
        }
        for (var i in this.allWindows) {
            this.allWindows[i].node.emit(event, param);
        }
    },

    /**
     * 分发事件是否激活
     * @param vee true 分发事件可以用，false 分发事件不能用
     */
    setEmitEventEnabled: function (vee) {
        var vEmitType = typeof (vee);
        if (vEmitType == 'boolean' && this.isEmitEvent !== vee) {
            this.isEmitEvent = vee
        }
    },

    /**
     * 显示MessageBox
     * @param msg 消息
     * @param type 按钮位置 None 0 , Message 100
     * @param confirm 按钮A 确定按钮回调
     * @param cancel  按钮B 按钮回调
     * @param confirmStr 按钮A文字 废弃了
     * @param cancelStr  按钮B文字 废弃了
     */
    showMessageBox: function (msg, type = enMsgType.None, confirm = null, cancel = null, confirmStr = '', cancelStr = '') {
        // Log.debug('\t\t显示MessageBox');
        var messageBoxView = this.getWindow(enCommonUI.MessageBoxUI);
        if (!messageBoxView) {
            if (!this._MessageBox) {
                Log.error('MessageBox 预制体为空');
                return;
            }
            var node = cc.instantiate(this._MessageBox);
            node.zIndex = LayerType.MessageBox;
            messageBoxView = node.getComponent('UIMessageBox');
            messageBoxView.onInit();
        }
        messageBoxView.setMessage(msg, type, confirm, cancel, confirmStr, cancelStr);
        messageBoxView.showWindow();
    },
    /**
     * 销毁MessageBox
     */
    hideMessageBox() {
        var messageBoxView = this.getWindow(enCommonUI.MessageBoxUI);
        if (messageBoxView) {
            if (messageBoxView.getIsShowWindow()) {
                messageBoxView.hideWindow();
            }
        }
    },


    /**
     * 显示Await
     * @param msg
     * @param position = cc.v2(0, 0),
     */
    showAwait: function (msg, position = cc.v2(0, 0), vCallFuncton = null) {
        var awaitView = this.getWindow(enCommonUI.AwaitUI);
        if (!awaitView) {
            if (!this._Await) {
                Log.error('Await 预制体为空');
                return;
            }
            var node = cc.instantiate(this._Await);
            node.zIndex = LayerType.Await;
            awaitView = node.getComponent('UIAwait');

            {//动态加载动画文件
                cc.loader.loadRes('animation/await', function (err, res) {
                    if (err) {
                        Log.error('预制体为空 动画res:' + err.message || err);
                        return;
                    }
                    if (node.name) {
                        node.getComponent('UIAwait').setImageAnimation(res);
                    }
                }.bind(this))
            }
            awaitView.onInit();
        }
        awaitView.setMessage(msg);
        awaitView.setPosition(position);
        awaitView.setBackFunction(vCallFuncton);
        awaitView.showWindow(); // this.showWindow(enCommonUI.AwaitUI);
    },
    /**
     * 销毁Await
     */
    hideAwait() {
        var awaitView = this.getWindow(enCommonUI.AwaitUI);
        if (awaitView) {
            awaitView.hideWindow();
        }
    },
    /**
     *  添加Tips
     * @param {string} msg 设置弹出的文字
     * @param {int} effectType 弹出类型 1下到上 2从外到里
     * @param {cc.color} color 文字颜色
     * @param {cc.v} position cc.v(0,0); 显示到的位置
     * @param {int} fontSize 文字大小
     * @param {boolean} isPrefab  是否使用预制体
     * @param {int} animationTime  动画播放时间
     * @param {boolean} isFadeOut  true 隐藏飘带文字变暗，false 开启
     */
    addTips: function (msg, effectType = 1, position = cc.v2(0, 0), color = cc.color(255, 255, 255), fontSize = 24, isPrefab = false, animationTime = 2, isFadeOut = false) {
        var tipsView = this.getWindow(enCommonUI.TipsUI);
        if (!tipsView) {
            if (!this._Tips) {
                Log.error('Tips 预制体为空');
                return;
            }
            var node = cc.instantiate(this._Tips);
            node.zIndex = LayerType.Tips;
            tipsView = node.getComponent('UITips');
            tipsView.onInit();
        }
        tipsView.addTips(msg, effectType, position, color, fontSize, isPrefab, animationTime, isFadeOut);
        tipsView.showWindow();// this.showWindow(enCommonUI.TipsUI);
    },
    /**
     * 销毁Revole
     */
    hideTips() {
        var tipsView = this.getWindow(enCommonUI.TipsUI);
        if (tipsView) {
            tipsView.hideWindow();
        }
    },
    /**
     * 添加跑马灯文字
     * @param msg 显示的消息
     * @param addObjectNode 添加到指定对象上(cc.Node)
     * @returns {*}
     */
    addRevole: function (msg, addObjectNode = null) {
        var isOpen = false;
        if (addObjectNode) {
            if (addObjectNode instanceof cc.Node) {
                isOpen = true;
            }
            if (!isOpen) {
                Log.error('跑马灯添加的对象不是node类型');
            }
            if (isOpen) {
                if (this._Revolve) {
                    var revolveView = cc.instantiate(this._Revolve);
                    addObjectNode.addChild(revolveView);
                    //node.zIndex = LayerType.Revole;
                    revolveView = revolveView.getComponent('UIRevolve');
                    // revolveView.onInit();

                    revolveView.addTips(msg);
                    // revolveView.node.setPositionY((cc.winSize.height * 0.5) * 0.67);
                    revolveView.showWindow();
                    return revolveView;
                }
            }
        } else {
            var revolveView = this.getWindow(enCommonUI.RevolveUI);
            if (!revolveView) {
                if (!this._Revolve) {
                    Log.error('Revolve 预制体为空');
                    return null;
                }
                var node = cc.instantiate(this._Revolve);
                node.zIndex = LayerType.Revole;
                revolveView = node.getComponent('UIRevolve');
                revolveView.onInit();
            }
            revolveView.addTips(msg);
            // revolveView.node.setPositionY((cc.winSize.height * 0.5) * 0.67);
            revolveView.node.y = ((cc.winSize.height * 0.5) * 0.67);
            revolveView.showWindow();// this.showWindow(enCommonUI.RevolveUI);
            return revolveView;
        }

        return null;
    },

    /**
     * 销毁Revole
     */
    hideRevole() {
        var revolveView = this.getWindow(enCommonUI.RevolveUI);
        if (revolveView) {
            revolveView.hideWindow();
        }
    },
});
