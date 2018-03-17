var App = require('App');
var UIWindow = require('UIWindow');
var enWinType = require('UIWindowDef').enWinType;
var enViewType = require('Consts').enViewType;
var enWinShowType = require('UIWindowDef').enWinShowType;

var LobbySendMsgs = require('LobbySendMsgs');

cc.Class({
    extends: UIWindow,

    properties: {
        roomIdLabel: cc.Label,// 房间ID的label
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        if (App.Init()) { // 初始化控制器
        }
        this.gameInit();

    },
    //< 初始化窗口
    onInit: function () {
        // 注册ID
        this.windowID = enViewType.GameUI;
        // 设置窗口类型
        this.windowType = enWinType.WT_Normal;
        // 弹出方式
        this.showType = enWinShowType.WST_HideOther;
        this._super();
    },
    // 游戏初始化
    gameInit: function () {
        if (this.roomIdLabel){
            var roomObj = App.UserManager.getRoom();
            if (roomObj){
                this.roomIdLabel.string = roomObj.roomId;
            }
        }
    },




    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
