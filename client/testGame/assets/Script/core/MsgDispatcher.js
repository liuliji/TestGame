/************************************************************************
 * Copyright (c) 2016 App
 * Author      : Shao
 * Mail        : yi-shaoye@163.com
 * Date        : 2018-03-27
 * Use         : 数据包处理调度器
 ************************************************************************/


module.exports = cc.Class({
    properties: {
        msgStack: [],// 消息堆栈
        canProcessMsg: false,
    },

    /**
     * 构造函数
     */
    ctor: function () {

    },

    /**
     * 将所有的消息push到堆栈中
     * @param cb 回调的方法
     * @param args 方法的参数
     */
    pushMsg: function (cb,args) {
        var value = {
            func: cb,
            args: args,
        }
        this.msgStack.push(value);
        debugger;
    },

    /**
     * 处理网络回包的所有消息
     */
    processMessage: function () {
        if (!this.canProcessMsg)
            return;

        if (this.msgStack.length <= 0)
            return;
    },

    /**
     * 是否可以处理网络消息
     * @param boolValue
     */
    setCanProcess: function (boolValue) {
        this.canProcessMsg = boolValue;
    }
});

