var BaseClass = require('BaseClass');
module.exports = cc.Class({
    extends: BaseClass,

    properties: {

    },
    // 构造函数
    ctor: function () {

    },
    /**
     * 传入的链接是带有 ? 的
     */
    // 发送get请求
    getRequest: function (url, data, callback) {
        // 创建一个http请求
        var xRequest = new XMLHttpRequest();
        // 参数拼接
        var param = '';
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (!param) {
                    var value = data[key];
                    param += key + '=' + value;
                } else {
                    var value = data[key];
                    param += '&' + key + '=' + value;
                }

            }
        }
        url +=  + param;
        // debugger;
        // xRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // 设置状态回调
        xRequest.onreadystatechange = function () {
            // debugger;
            if (xRequest.readyState == 4 && (xRequest.status >= 200 && xRequest.status < 400)) {
                var responseText = xRequest.responseText;
                // 将返回值转成对象
                responseText = JSON.parse(responseText);
                // 消息发送成功后，回调
                if ((typeof callback) == 'function') {
                    callback(responseText);
                }
            }
        }.bind(this);
        xRequest.open("GET", url, true);
        xRequest.send();
    },
    // 发送post请求
    postRequest: function () {
        // 创建一个http请求
        var xRequest = new XMLHttpRequest();
        // 参数拼接
        var param = '';
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (!param) {
                    var value = data[key];
                    param += key + '=' + value;
                } else {
                    var value = data[key];
                    param += '&' + key + '=' + value;
                }

            }
        }
        url +=  + param;
        // debugger;
        xRequest.responseType = 'text';
        xRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // 设置状态回调
        xRequest.onreadystatechange = function () {
            // debugger;
            if (xRequest.readyState == 4 && (xRequest.status >= 200 && xRequest.status < 400)) {
                var responseText = xRequest.responseText;
                // 将返回值转成对象
                responseText = JSON.parse(responseText);
                // 消息发送成功后，回调
                if ((typeof callback) == 'function') {
                    callback(responseText);
                }
            }
        }.bind(this);
        xRequest.open("POST", url, true);
        xRequest.send();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
