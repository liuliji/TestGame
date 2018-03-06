
var BaseClass = require('BaseClass');
if(window.io == null){
    window.io = require("socket-io");
}
module.exports = cc.Class({
    extends: BaseClass,
    // 属性
    properties: {
        socket:null,
    },
    // 构造函数
    ctor: function(){
        
    },
    // 创建socket连接，并设置监听
    connect: function(ip){
        // 创建连接
        this.socket = window.io.connect(ip);
        // 连接成功监听
        this.socket.on('connect',this.onConnectSuccess.bind(this));
        // 连接失败监听
        this.socket.on('connect_error',this.onConnectError.bind(this));
        // 断开连接监听
        this.socket.on('disconnect',this.onDisconnected.bind(this));
        // 收到消息监听
        this.socket.on('s2c_msg',this.onMessage.bind(this));
    },
    // 创建连接成功
    onConnectSuccess: function(data){
        console.log('connect Success: ' + JSON.stringify(data));
    },
    // 创建连接失败
    onConnectError: function(data){
        console.log('connect failed: ' + JSON.stringify(data));
    },
    // 断开连接
    onDisconnected: function(data){
        console.log('connect disconnected: ' + JSON.stringify(data));
    },
    // 收到消息
    onMessage: function(data){
        console.log('onMessage: ' + JSON.stringify(data));
    },
    // 发送消息
    sendMessage: function(data){
        this.socket.emit('c2s_msg',data);
    },
});