/************************************************************************
 * Copyright (c) 2017 cardgame
 * Author    : liuliji
 * Mail        : liuliji1184899343@163.com
 * Date        : 2017-5-11
 * Use      : iOS支付
 ************************************************************************/

var App = require('App');
var HttpOrderSendMsgs = require("HttpOrderSendMsgs");
var enMsgType = require('UIWindowDef').enMsgType;

function IOSPay() {
    
};
/**
 * 
 */
IOSPay.prototype.init = function(){
    reqIOSPurchaseSuccess_cb = this.iOSPurchaseSuccess.bind(this);
    reqIOSFinish_cb = this.iOSPurchaseFinish.bind(this);
}
/**
 * @param 计费代码
 */
IOSPay.prototype.iOSPurchaseSuccess = function(produceId ,code){
    Log.info('*******************produceId：   ' + produceId);
    Log.info('*******************支付成功：   ' + code);


    // 购买成功后 把code保存到本地 防止用户购买成功 但是服务器未给玩家添加上钻石
    HttpOrderSendMsgs.send2ServerIOSCode(produceId, code);

    sgm.MethodsUtils.saveLocalData('ios_payCode', code);
    sgm.MethodsUtils.saveLocalData('ios_payProduceId', produceId);

    App.UIManager.hideAwait();
}
//iOS支付结束回调（成功以外的情况）
IOSPay.prototype.iOSPurchaseFinish = function(){
    App.UIManager.hideAwait();
    var str = " 支付失败！请检查网络或iCloud账号，重新购买"
    App.UIManager.showMessageBox(str, enMsgType.None, function () { }.bind(this));
}
//购买商品
IOSPay.prototype.buyWithId = function(productId, orderId){
    Log.debug('=========IOSPay购买商品============');
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("IAPManager", "buyWithId:orderId:", productId,orderId);
        } else if (cc.sys.OS_ANDROID == cc.sys.os) {
            
        }
    }
}
//初始化
IOSPay.prototype.createManager = function(){
    Log.debug('==========IOSPay初始化============');
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("IAPManager", "defaultManager");
        } else if (cc.sys.OS_ANDROID == cc.sys.os) {
            
        }
    }
}


/**
 * 导出函数
 */
var obj = new IOSPay();
module.exports = obj;