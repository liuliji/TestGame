var App = require('App');
var UIWindow = require('UIWindow');
var enWinType = require('UIWindowDef').enWinType;
var enViewType = require('Consts').enViewType;
var enWinShowType = require('UIWindowDef').enWinShowType;

var WSph = require('WSph');

var LobbySendMsgs = require('LobbySendMsgs');

cc.Class({
    extends: UIWindow,

    properties: {
        resultLabel: cc.Label,
        socket: null,// WSph对象

        deletePanel: cc.Node,// 删除房间的panel
        deleteEdit: cc.EditBox,// 删除房间的editBox

        chatPanel: cc.Node,// 聊天的panel
        chatEdit: cc.EditBox,// 聊天的editBox

    },

    // use this for initialization
    onLoad: function () {
        this._super();
        if (App.Init()) { // 初始化控制器
        }
        // this.socket = new WSph();
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
        this.node.on('create_room',this.onCreateRoomCallback.bind(this));
        this.node.on('enter_room',this.onEnterRoomCallback.bind(this));
    },

    // socket连接按钮的点击事件
    onSocketBtnClick: function () {
        // 在这里设置要连接的socket地址
        // this.socket.connect('');
        App.Socket.connect('');
    },

    // 发送消息
    onSendMsg: function () {
        if (!this.socket){
            Log.debug('当前还没有进行socket连接，所以无法给服务器发送消息');
            this.socket = new WSph();
            this.socket.connect();
            return;
        }
        this.socket.send('这是客户端给服务器发送的消息的内容，服务器能收到吗？？？');
    },

    // 创建房间
    onCreateRoom: function () {
        LobbySendMsgs.onCreateRoom();
    },

    // 显示房间的面板，并输入房间号
    onShowDeletePanel: function () {
        if (this.deletePanel){
            this.deletePanel.active = true;
        }
    },

    // 删除房间
    onDeleteRoom: function () {
        // debugger;
        if (this.deleteEdit){
            var roomId = this.deleteEdit.string;
            if (roomId != ''){
                LobbySendMsgs.onDeleteRoom(roomId);
            } else {
                LobbySendMsgs.onDeleteRoom(this.roomId);
            }
        }

    },

    // 显示加入房间面板
    onShowEnterRomPanel: function () {

    },

    // 加入房间
    onEnterRoom: function () {

    },

    // 网络消息回调
    onWebsocketCallback: function (event) {
        var msg = event.detail;
        if (this.resultLabel){
            this.resultLabel.string = msg;
        }
    },

    // 创建房间成功
    onCreateRoomCallback: function (event) {
        var args = event.detail;
        this.roomId = args.room_id;
        if (this.resultLabel){
            this.resultLabel.string = JSON.stringify(args);
        }
    },

    // 加入房间成功
    onEnterRoomCallback: function (event) {
        var args = event.detail;
        if (this.resultLabel){
            this.resultLabel.string = JSON.stringify(args);
        }
    },

    // 显示房间的面板，并输入房间号
    onShowChatPanel: function () {
        if (this.chatPanel){
            this.chatPanel.active = true;
        }
    },

    onChat: function () {
        if (this.chatEdit){
            var chatStr = this.deleteEdit.string;
            if (chatStr != ''){
                LobbySendMsgs.onTalk(chatStr);
            }
        }
    },

    // 隐藏panel
    onHidePanel: function (object) {
        // debugger;
        var target = object.target;
        target.parent.active = false;
    },

    onBackClick: function () {
        return;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
