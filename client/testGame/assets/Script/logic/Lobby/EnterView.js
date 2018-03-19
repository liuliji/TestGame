var App = require('App');
var UIWindow = require('UIWindow');
var enWinType = require('UIWindowDef').enWinType;
var enViewType = require('Consts').enViewType;
var enWinShowType = require('UIWindowDef').enWinShowType;

var LobbySendMsgs = require('LobbySendMsgs');

cc.Class({
    extends: UIWindow,

    properties: {
        roomId: '',// 房间号
        roomIdLabel: cc.EditBox,// 输入房间号
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
        this.windowID = enViewType.EnterUI;
        // 设置窗口类型
        this.windowType = enWinType.WT_Normal;
        // 弹出方式
        this.showType = enWinShowType.WST_HideOther;
        this._super();
    },
    // 游戏初始化
    gameInit: function () {
        // this.node.on('create_room',this.onCreateRoomCallback.bind(this));
        // this.node.on('enter_room',this.onEnterRoomCallback.bind(this));
        this.node.on('join_room_ok',this.onEnterRoomCallback.bind(this));
        // 便于键盘输入
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

    },
    // 创建房间
    onCreateRoom: function () {
        LobbySendMsgs.onCreateRoom();
    },

    onEnterRoom: function () {
        App.Socket.switchChannel(this.roomIdLabel.string)
        //     function () {
        //     cc.director.loadScene('game');
        // }.bind(this)
        // LobbySendMsgs.onEnterRoom(this.roomId);
    },

    // 键盘输入监听，便于平时调试
    onKeyDown(event) {
        // Log.debug('键盘按键:' + event.keyCode);
        var value = '0';
        var data = {
            target: 'keyboard'
        }

        switch (event.keyCode) {
            case cc.KEY.num0:
            case cc.KEY['0']:
                value = '0';
                break;
            case cc.KEY.num1:
            case cc.KEY['1']:
                value = '1';
                break;
            case cc.KEY.num2:
            case cc.KEY['2']:
                value = '2';
                break;
            case cc.KEY.num3:
            case cc.KEY['3']:
                value = '3';
                break;
            case cc.KEY.num4:
            case cc.KEY['4']:
                value = '4';
                break;
            case cc.KEY.num5:
            case cc.KEY['5']:
                value = '5';
                break;
            case cc.KEY.num6:
            case cc.KEY['6']:
                value = '6';
                break;
            case cc.KEY.num7:
            case cc.KEY['7']:
                value = '7';
                break;
            case cc.KEY.num8:
            case cc.KEY['8']:
                value = '8';
                break;
            case cc.KEY.num9:
            case cc.KEY['9']:
                value = '9';
                break;
            case cc.KEY.backspace:// 删除
            case cc.KEY['10']:
                value = '10';

                var data = {
                    target: {
                        name: 'num_12'
                    }
                }
                break;
        }
        this.onClickNumber(data, value);
    },
    /**
     * 点击数字触摸事件
     * @param data
     * @param value
     */
    onClickNumber: function (data, value) {
        if (data && data.target){
            let num = parseInt(value);
            if (num >= 0 && num <= 9) {
                this.roomId += value;
                this.roomIdLabel.string = this.roomId;
            } else {
                switch (data.target.name) {
                    case "num_11":
                        this.setClearNum();
                        break;
                    case "num_12":
                        if (this.roomId && this.roomId.length > 0){
                            this.roomId.substring(0, this.roomId.length - 1);
                            this.roomIdLabel.string = this.roomId;
                        }
                        break;
                    default:
                        return;
                }
            }
        }

        // if (data && data.target) {
        //     let num = parseInt(value);
        //     if (num >= 0 && num <= 9) {
        //         if (this._cur_count < CUR_MAX_COUNT) {
        //             this._ary_room_nums[this._cur_count] = num;
        //             this.room_nums[this._cur_count++].string = num;
        //         }
        //     } else {
        //         switch (data.target.name) {
        //             case "num_11":
        //                 this.setClearNum();
        //                 break;
        //             case "num_12":
        //                 if (this._cur_count > 0) {
        //                     this._cur_count--;
        //                     this.room_nums[this._cur_count].string = "";
        //                     this._ary_room_nums[this._cur_count] = -1;
        //                 }
        //                 break;
        //             default:
        //                 return;
        //         }
        //     }
        // }
        // let isOpen = false;
        // var roomId = 0;//房间号
        // let gps = 0;   //0:未获取到gpf , 1:有gpf
        // if (this._cur_count == CUR_MAX_COUNT) {
        //     for (var i = 0; i < this._ary_room_nums.length; i++) {
        //         roomId = roomId * 10 + this._ary_room_nums[i];
        //     }
        //     isOpen = true;
        // } else if (this._cur_count == (CUR_MAX_COUNT - 1) && !this._zrToggleIsChecked) {
        //     isOpen = true;
        //     let iCount = CUR_MAX_COUNT - 1;
        //     for (var i = 0; i < iCount; i++) {
        //         roomId = roomId * 10 + this._ary_room_nums[i];
        //     }
        // }

        // if (isOpen) {
        //     var zrId = (this._zrToggleIsChecked == true) ? 1 : 2;//(1正常房,2随机房,其他保存没有数据)
        //     sgm.MethodsUtils.saveLocalData(sgc.StorageConst.CreateRoom.ENTER_ROOM_ZR_TOGGLE, zrId);
        //     let locationXY = LocationSDK.getXY();
        //     if (locationXY.longitude == '') {
        //         gps = 0;
        //     } else {
        //         gps = 1;
        //     }
        //
        //     Log.debug("加入房间号:" + roomId);
        //     Log.debug("加入房间gps:" + JSON.stringify(locationXY));
        //     Log.debug("加入房间GPS开关:" + gps);
        //     Log.debug("1正常房,2随机房,其他保存没有数据:" + zrId);
        //
        //     //加入房间
        //     LobbySendMsgs.onEnterRoom(roomId, gps);
        //     App.UIManager.showAwait();
        //     this.setClearNum();
        // }
    },
    setClearNum: function () {
        // let vCount = this._ary_room_nums.length;
        // for (var i = 0; i < vCount; i++) {
        //     if (this._ary_room_nums[i]) {
        //         this._ary_room_nums[i] = -1;
        //     }
        // }
        // for (var i in this.room_nums) {
        //     if (this.room_nums[i]) {
        //         this.room_nums[i].string = "";
        //     }
        // }
        // this._cur_count = 0;
        this.roomId = '';
        this.roomIdLabel.string = this.roomId;
    },

    hideThis: function () {
        App.UIManager.hideWindow(this.windowID);
    },

    // 加入房间成功
    onEnterRoomCallback: function (event) {
        debugger;
        var args = event.detail;
        // if (this.resultLabel){
        //     this.resultLabel.string = JSON.stringify(args);
        // }
        // cc.director.loadScene('game');


        App.Socket.switchChannel(this.roomIdLabel.string);
        // function () {
        //     // cc.director.loadScene('game');
        // }.bind(this));
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
