var App = require('App');
var UIWindow = require('UIWindow');
var enWinType = require('UIWindowDef').enWinType;
var enViewType = require('Consts').enViewType;
var enWinShowType = require('UIWindowDef').enWinShowType;

var LobbySendMsgs = require('LobbySendMsgs');

cc.Class({
    extends: UIWindow,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
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
        this.windowID = enViewType.LobbyUI;
        // 设置窗口类型
        this.windowType = enWinType.WT_Normal;
        // 弹出方式
        this.showType = enWinShowType.WST_HideOther;
        this._super();
    },
    // 游戏初始化
    gameInit: function () {
        // this.node.on('create_room',this.onCreateRoomCallback.bind(this));
        // this.node.on('join_room',this.onEnterRoomCallback.bind(this));

    },
    // 创建房间
    onCreateRoom: function () {
        LobbySendMsgs.onCreateRoom();
    },

    // 加入房间面板显示
    onEnterRoom: function () {
        App.UIManager.showWindow(enViewType.EnterUI);
    },
    // 加入房间成功
    // onEnterRoomCallback: function (event) {
    //     var args = event.detail;
    //     // if (this.resultLabel){
    //     //     this.resultLabel.string = JSON.stringify(args);
    //     // }
    //     // cc.director.loadScene('game');
    //
    //
    //     App.Socket.switchChannel(this.roomId,function () {
    //         cc.director.loadScene('game');
    //     }.bind(this));
    // },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
