// import {onConnectSuccess} from 'WebsocketScript';
var BaseClass = require('BaseClass');

var Socket = require('phoenix').Socket;// 使用phoenix的socket

var App = require('App');
var ProtoCfg = require('ProtoCfg');


module.exports = cc.Class({
    extends: BaseClass,

    properties: {
        socket: null,// 当前类的socket属性，初始化后，会只想Socket的一个对象
        chan: null,// socket的channel
    },

    // use this for initialization
    onLoad: function () {

    },

    // 创建socket连接
    connect: function (ip) {
        /**
         * 如果socket已经存在，就将channel置空，同时，断开当前的socket连接，
         * 重新建立连接
         */
        if (this.socket) {
            this.chan.leave();
            this.chan = null;
            // 如果有，就断开连接，重新创建新的连接
            this.socket.disconnect();
        }

        /**
         * 创建socket连接，并发起连接请求
         */
        this.socket = new Socket("ws://192.168.99.244:4000/socket", {params: {user_id: "123"}});
        this.socket.connect();

        /**
         * 设置socket的事件监听
         */
        this.socket.onError(() => console.log("there was an error with the connection!"));
        this.socket.onClose(() => console.log("the connection dropped"));

        /**
         * 获取channel，同时，设置消息监听，同时，设置错误监听和关闭的监听函数
         */
        this.chan = this.socket.channel('room:lobby');
        this.chan.on("server_msg", this.onMessage.bind(this));// 监听new_msg消息
        this.chan.onError(() => console.log("there was an error!"));
        this.chan.onClose(() => console.log("the channel has gone away gracefully"));
        this.chan.onClose(this.onDisconnected.bind(this));

        // 创建了socket之后，注册事件回调
        this.registerEvent();
        
        this.chan.join()
        .receive("ok", ({messages}) => console.log("catching up", messages) )
        .receive("error", ({reason}) => console.log("failed join", reason) )
        .receive("timeout", () => console.log("Networking issue. Still waiting...") );

    },

    /**
     * 注册事件回调
     */
    registerEvent: function () {
        debugger;
        // 首先取出所有的收包的消息对应的文件
        if (App){

        }
        var recvs = ProtoCfg.recv;
        var handles = ProtoCfg.handle;
        if (this.chan){
            // 依次获取每个文件
            for (let handleObj in recvs){
                debugger;
                var handleClass;
                for (let handle in handles){
                    debugger;
                }
                if (handleClass){
                    // 取出每个文件对应的方法的结构体
                    var handleEvents = recvs[handleObj];
                    // 取出每个方法，并绑定回调
                    for (let value in handleEvents){
                        var eventName = handleEvents[value]['id'];
                        var func = handleEvents[value]['function'];
                        this.chan.on(eventName,handleClass[func].bind(handleClass));
                        debugger;
                    }
                }

            }
        }
    },

    /*****************************socket事件监听开始***************************/
    // 创建连接成功
    onConnectSuccess: function (event) {
        console.log('connect Success: ' + JSON.stringify(event));
    },
    // 创建连接失败
    onConnectError: function (event) {
        console.log('connect failed: ' + JSON.stringify(event));
    },
    // 断开连接
    onDisconnected: function (event) {
        console.log('connect disconnected: ' + JSON.stringify(event));
    },
    // 收到消息
    onMessage: function (msg) {
        console.log('onMessage: ' + JSON.stringify(msg));
        App.UIManager.emit('wsCallback', JSON.stringify(msg));
    },


    send: function (data) {
        if (this.chan) {
            /**
             * 第一个字段，第二个字段是消息，第三个，感觉应该是消息内容的长度
             */
            this.chan.push("new_msg", {uid: "666"}, 1000)
                .receive("ok", (message) => console.log("created message", message))
                .receive("error", (reasons) => console.log("create failed", reasons))
                .receive("timeout", () => console.log("Networking issue. Still waiting..."));
        } else {
            Log.debug('当前socket的channel为空');
        }
    }


    /*****************************socket事件监听结束***************************/

});
