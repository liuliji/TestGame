// import {onConnectSuccess} from 'WebsocketScript';
var BaseClass = require('BaseClass');

var Socket = require('phoenix').Socket;// 使用phoenix的socket

// var ProtoCfg = require('ProtoCfg');
var ProtoCfg = require('ProtoCfg');

module.exports = cc.Class({
    extends: BaseClass,

    properties: {
        socket: null,// 当前类的socket属性，初始化后，会只想Socket的一个对象
        chan: null,// socket的channel
        events:null,// 消息回调
        type: 1,// 连接的channel类型，1为lobby，2为大厅
    },

    // use this for initialization
    ctor: function () {
        this.events = {};
    },

    /**
     * 连接时间注册
     * @param id 事件ID
     * @param cb 事件回调
     */
    registerEventListener: function (id,cb) {
        this.events[id] = cb;
    },

    /**
     * 创建socket连接
     * @param uid 玩家的ID
     * @param channel 想要连接到哪个channel
     */
    connect: function (uid,channel,type) {
        /**
         * 如果socket已经存在，就将channel置空，同时，断开当前的socket连接，
         * 重新建立连接
         */
        if (this.socket) {
            this.chan = null;
            // 如果有，就断开连接，重新创建新的连接
            this.socket.disconnect();
        }
        // socket类型
        this.type = type;

        /**
         * 创建socket连接，并发起连接请求
         */
        // this.socket = new Socket("ws://192.168.99.244:4000/socket", {params: {user_name: uid}});
        this.socket = new Socket("ws://localhost:4000/socket", {params: {userName: uid}});
        /**
         * 设置socket的事件监听
         */
        this.socket.onOpen(this.onSocketConnectSuccess.bind(this));
        this.socket.onError(this.onSocketConnectError.bind(this));
        this.socket.onClose(this.onSocketClose.bind(this));
        this.socket.connect();

        // 连接到channel
        this.switchChannel(channel);


    },

    /*****************************socket事件监听开始***************************/
    /**
     * socket连接成功
     */
    onSocketConnectSuccess: function () {
        if (this.events['socket_success']){
            this.events['socket_success'](this.type);
        }
    },

    /**
     * socket连接失败
     * @param msg 失败原因
     */
    onSocketConnectError: function (msg) {
        Log.debug('创建socket连接失败：' + JSON.stringify(msg));
        if (this.events['socket_error']){
            this.events['socket_error']();
        }
    },

    /**
     * 断开socket连接
     */
    onSocketClose: function () {
        if (this.events['socket_close']){
            this.events['socket_close']();
        }
    },
    /*****************************socket事件监听结束***************************/

    /**
     * 切换到其他的channel
     * @param channel 字符串类型，切换channel
     */
    switchChannel: function (channel) {
        // debugger;
        if (this.chan){
            this.chan.leave().receive("ok",function () {
                this.createChannelAndRegistEvent(channel);
            }.bind(this));
        } else {
            this.createChannelAndRegistEvent(channel);
        }
    },

    /**
     * 创建channel，并设置回调方法
     * @param channel
     * @param cb
     */
    createChannelAndRegistEvent: function (channel) {
        // debugger;

        if (channel){
            /**
             * 设置链接成功的回调方法
             */
            this.chan = this.socket.channel(channel);
            // this.chan.on("server_msg", this.onMessage.bind(this));// 监听new_msg消息
            this.chan.onError(() => console.log("there was an error!"));
            this.chan.onClose(() => console.log("the channel has gone away gracefully"));
            this.chan.onClose(this.onDisconnected.bind(this));

            // 创建了socket之后，注册事件回调
            this.registerEvent();

            this.chan.join()
                .receive("ok",
                    function (msg) {// channel连接成功
                        // debugger;
                        this.onSwitchSuccess(msg,channel)
                    }.bind(this))
                .receive("error", function (reason) {// channel连接失败
                    this.onJoinError(reason,channel)
                }.bind(this) )
                .receive("timeout", function () {// channel连接超时
                    this.onJoinTimeOut(channel);
                }.bind(this) );
        } else {
            // debugger;
            console.log('未设置要连接到哪个channel');
        }

    },

    /*****************************channel事件监听开始***************************/
    /**
     * 切换channel成功回调
     * @param msg
     */
    onSwitchSuccess: function (msg,channel) {
        // debugger;
        Log.debug('切换channel成功消息：' + JSON.stringify(msg));
        Log.debug('切换channel成功channel————' + channel);
        if (this.events['join_success']){
            this.events['join_success'](msg,channel);
        }
    },

    /**
     * 加入channel失败
     * @param msg 失败信息
     * @param channel 要加入的channel
     */
    onJoinError: function (msg,channel) {
        if (this.events['join_error']){
            this.events['join_error'](msg);
        }
    },

    /**
     * 加入channel超时
     * @param channel
     */
    onJoinTimeOut: function (channel) {
        if (this.events['join_timeout']){
            this.events['join_timeout'](channel);
        }
    },
    // 断开连接
    onDisconnected: function(data){
        console.log('connect disconnected: ' + JSON.stringify(data));
    },
    /*****************************channel事件监听结束***************************/

    /**
     * 注册事件回调
     */
    registerEvent: function () {
        // 首先取出所有的收包的消息对应的文件
        var ProtoCfg = require('ProtoCfg');
        var recvs = ProtoCfg.recv;
        var handles = ProtoCfg.handle;
        if (this.chan){
            // 依次获取每个文件
            for (let handleObj in recvs){
                // debugger;
                var handleFuncs = {};
                for (let id in handles){// 将所有的回调方法都放到handleFunc里面
                    for (let key in handles[id]){
                        handleFuncs[key] = handles[id][key];
                    }
                }
                // debugger;
                // 有处理函数，才进行事件监听
                if (handleFuncs && Object.getOwnPropertyNames(handleFuncs).length){
                    // 取出每个文件对应的方法的结构体
                    var handleEvents = recvs[handleObj];
                    // debugger;
                    // 取出每个方法，并绑定回调
                    for (let i = handleEvents.length - 1; i >= 0; i --){
                        var eventName = handleEvents[i]['id'];
                        var funcName = handleEvents[i]['function'];
                        for (let j in handleFuncs){
                            let func = handleFuncs[j];
                            /**
                             * 找到方法后，就直接注册，然后从数组中删除该方法，
                             * 并跳出循环，进行下次的循环，这样能够尽量减少循环的次数
                             */
                            if (func && func.name == funcName){
                                this.chan.on(eventName,handleFuncs[funcName]);
                                break;
                            }
                        }

                        // debugger;
                    }
                }

            }
        }
    },


    /**
     * 客户端向服务器发送消息
     * @param msgId 消息ID
     * @param args 消息内容
     */
    sendMsg: function (msgId,args) {
        var App = require('App');
        if (this.chan) {
            /**
             * 第一个字段，第二个字段是消息，第三个，感觉应该是消息内容的长度
             */
            this.chan.push(msgId, args, 10000)
                .receive("ok", function (message) {
                    // debugger;
                    console.log("created message", message);
                    if (msgId == 'ID_C2S_CREATE_ROOM'){
                        App.UIManager.emit('create_room',message);
                    }
                    if (msgId == 'ID_S2C_JOIN_ROOM'){
                        App.UIManager.emit('join_room_ok',message);
                    }
                }.bind(this))
                .receive("error", (reasons) => console.log("create failed", reasons))
                .receive("timeout", () => console.log("Networking issue. Still waiting..."));
        } else {
            Log.debug('当前socket的channel为空');
        }
    }

});
