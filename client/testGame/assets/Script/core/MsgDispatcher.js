/************************************************************************
 * Copyright (c) 2016 App
 * Author      : Shao
 * Mail        : yi-shaoye@163.com
 * Date        : 2018-03-27
 * Use         : 数据包处理调度器
 ************************************************************************/


module.exports = cc.Class({
    properties: {
        msgMap: null,// 所有的消息列表
        msgStack: [],// 收到的消息堆栈
        canProcessMsg: false,
    },

    /**
     * 构造函数
     */
    ctor: function () {
        this.msgMap = {};
        this.msgStack = [];
        this.registerCallbackFunc();
    },

    registerCallbackFunc: function () {
        var ProtoCfg = require('ProtoCfg');
        var App = require('App');
        var recvs = ProtoCfg.recv;
        var handles = ProtoCfg.handle;
        // 依次获取每个文件
        for (let handleObj in recvs) {
            // debugger;
            var handleFuncs = {};
            for (let id in handles) {// 将所有的回调方法都放到handleFunc里面
                for (let key in handles[id]) {
                    handleFuncs[key] = handles[id][key];
                }
            }
            // debugger;
            // 有处理函数，才进行事件监听
            if (handleFuncs && Object.getOwnPropertyNames(handleFuncs).length) {
                // 取出每个文件对应的方法的结构体
                var handleEvents = recvs[handleObj];
                // debugger;
                // 取出每个方法，并绑定回调
                for (let i = handleEvents.length - 1; i >= 0; i--) {
                    var eventName = handleEvents[i]['id'];
                    var funcName = handleEvents[i]['function'];
                    for (let j in handleFuncs) {
                        let func = handleFuncs[j];
                        /**
                         * 找到方法后，就直接注册，然后从数组中删除该方法，
                         * 并跳出循环，进行下次的循环，这样能够尽量减少循环的次数
                         */
                        if (func && func.name == funcName) {
                            // this.chan.on(eventName,handleFuncs[funcName]);
                            this.msgMap[func.name] = handleFuncs[funcName]
                            // this.chan.on(eventName,handleFuncs[funcName].bindMsg(App.MsgDispatcher));
                            break;
                        }
                    }

                    // debugger;
                }
            }

        }
    },

    /**
     * 将所有的消息push到堆栈中
     * @param cb 回调的方法
     * @param args 方法的参数
     */
    pushMsg: function (cb, args) {
        var value = {
            func: cb,
            args: args,
        }
        this.msgStack.push(value);
        // debugger;
    },

    /**
     * 处理网络回包的所有消息
     */
    processMessage: function () {
        if (!this.canProcessMsg)
            return;

        if (this.msgStack.length <= 0)
            return;
        if (this.msgStack && this.msgStack.length > 0) {
            var handle = this.msgStack.shift();
            if (!handle){
                return;
            }
            var func = handle.func;
            var args = handle.args;
            if (!func || !args){
                return;
            }
            var funcName = func.name;
            if (this.msgMap[funcName]){
                this.msgMap[funcName](args);
            }
        }

    },

    /**
     * 是否可以处理网络消息
     * @param boolValue
     */
    setCanProcessMsg: function (boolValue) {
        this.canProcessMsg = boolValue;
    }
});

