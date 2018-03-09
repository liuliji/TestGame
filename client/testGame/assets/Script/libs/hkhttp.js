var Ajax = require("phoenix").Ajax

exports.get = function (url, msg) {
    return request("get", url, msg)
}

exports.post = function (url, msg) {
    return request("post", url, msg)
}

function request(type, url, msg) {
    var callback = new Object

    Ajax.request(
        type,
        url,
        "application/json",
        (typeof(msg) == "object"?JSON.stringify(msg):msg),
        5000,
        function onTimeOut() {
            callback.onTimeOutCallBack && callback.onTimeOutCallBack()
        },
        function onMsg(msg) {

            status = msg.status;
            content = msg.content;
            callback.onOKCallBack && status == "ok" && callback.onOKCallBack(content)

            callback.onErrorCallBack && status == "error" && callback.onErrorCallBack(content)
        }
    )

    callback.onOK = function (onOK) {
        this.onOKCallBack = onOK
        return this;
    } 

    callback.onError = function (onError) {
        this.onErrorCallBack = onError
        return this;
    }

    callback.onTimeOut = function (onTimeOut) {
        this.onTimeOutCallBack = onTimeOut
        return this;
    }

    return callback;
}