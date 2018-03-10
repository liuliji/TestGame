// import {onConnectSuccess} from 'WebsocketScript';
var BaseClass = require('BaseClass');

var Socket = require('phoenix').Socket;// 使用phoenix的socket


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
        if (this.socket){
            this.chan = null;
            // 如果有，就断开连接，重新创建新的连接
            this.socket.disconnect();
        }

        /**
         * 创建socket连接，并发起连接请求
         */
        this.socket = new Socket(ip);
        this.socket.connect();

        /**
         * 设置socket的事件监听
         */
        socket.onError( () => console.log("there was an error with the connection!") )
        socket.onClose( () => console.log("the connection dropped") )

        /**
         * 获取channel，同时，设置消息监听，同时，设置错误监听和关闭的监听函数
         */
        this.chan = socket.channel('data');
        this.chan.onmessage("new_msg",this.onMessage.bind(this));// 监听new_msg消息
        this.chan.onError( () => console.log("there was an error!") )
        this.chan.onClose( () => console.log("the channel has gone away gracefully") )
        // this.chan.onError(this.onConnectError.bind(this));
        // this.chan.onClose(this.onDisconnected.bind(this));

    },

    /*****************************socket事件监听开始***************************/
    // 创建连接成功
    onConnectSuccess: function(event){
        console.log('connect Success: ' + JSON.stringify(event));
    },
    // 创建连接失败
    onConnectError: function(event){
        console.log('connect failed: ' + JSON.stringify(event));
    },
    // 断开连接
    onDisconnected: function(event){
        console.log('connect disconnected: ' + JSON.stringify(event));
    },
    // 收到消息
    onMessage: function(msg){
        console.log('onMessage: ' + JSON.stringify(msg));
        App.UIManager.emit('wsCallback',msg);
    },


    /*****************************socket事件监听结束***************************/


});
