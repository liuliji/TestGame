var App = require('App');
var UIWindow = require('UIWindow');
var enWinType = require('UIWindowDef').enWinType;
var enViewType = require('Consts').enViewType;
var enWinShowType = require('UIWindowDef').enWinShowType;

var WSph = require('WSph');


cc.Class({
    extends: UIWindow,

    properties: {
        resultLabel: cc.Label,
        socket: null,// WSph对象
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.socket = new WSph();
        // debugger;
        this.gameInit();
    },
    //< 初始化窗口
    onInit: function () {
        // 注册ID
        this.windowID = enViewType.TestUI;
        // 设置窗口类型
        this.windowType = enWinType.WT_Normal;
        // 弹出方式
        this.showType = enWinShowType.WST_HideOther;
        this._super();
    },

    // 游戏初始化
    gameInit: function () {
        this.node.on('wsCallback',this.onWebsocketCallback.bind(this));
    },

    // socket连接按钮的点击事件
    onSocketBtnClick: function () {
        // 在这里设置要连接的socket地址
        this.socket.connect('');
    },


    // 网络消息回调
    onWebsocketCallback: function (event) {
        var msg = event.detail;
        if (this.resultLabel){
            this.resultLabel.string = msg;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
