'use strict';
/**
 * HttpOrderSendMsgs
 * Created by success on 2017/7/26.
 */
var App = require('App');
var md5 = require('md5');
var enMsgType = require('UIWindowDef').enMsgType;

// http://127.0.0.1:63001/getStoreList 获取商城列表
// http://127.0.0.1:63001/order	获取订单
/*
 * 获取商城商品表单
 **/
function getShopList() {
    Log.info('---------向服务器发包:获取商城商品表单---------');
    var msg = {
    }
    App.Http.postProto('lobby', '/getStoreList', msg, 'ID_C2S_STORE_LIST');
    // App.Socket.sendMessage(msg, 'ID_C2S_STORE_LIST');
}
/**
 * 获取支付订单列表
 * @param orderId
 * @param uid
 * @param sysOs
 */
function getOrderList(orderId, uid, sysOs) {
    Log.info('---------向服务器发包:获取支付订单列表---------');
    var os_tp = 1;
    var os_tp2 = 1;
    if (cc.sys.os == cc.sys.OS_IOS){
        if (sysOs == 1){  // 微信支付
            os_tp2 = 1;
        } else {
            os_tp2 = 2;  //  苹果支付
        }
        os_tp = 2;
    } else if (cc.sys.OS_ANDROID == cc.sys.os){
        os_tp = 1;
        os_tp2 = 1;
    } else {
        var str = " 非适配系统手机，不能购买";
        App.UIManager.showMessageBox(str, enMsgType.None, function () { }.bind(this));
        return
    }
    var msg = {
        platformType: os_tp,    //平台类型 1-Andriod 2-IOS
        payType: os_tp2,        //支付渠道 1-微信支付 2-苹果支付
        commodityId: orderId,     //商品ID
        uid: uid,
    };
    Log.debug('发送请求-获取服务器订单号:'+JSON.stringify(msg));
    App.Http.postProto('lobby', '/order', msg, 'ID_C2S_GET_ORDER');
    App.UIManager.showAwait();
}

/**
 * 苹果支付单据
 * @param orderId
 * @param code
 */
function send2ServerIOSCode(orderId, code) {
    Log.info('---------向服务器发包:苹果支付单据---------');
    var selfData = App.UserManager.getSelf();
    var msg = {
        uid: selfData.uid,
        code: code,
        orderId: ''+orderId,
    }
    Log.debug('苹果支付单据-把code值发送给服务器:'+JSON.stringify(msg));
    App.Http.postProto('lobby', '/appleVerify', msg, 'ID_C2S_APPLE_PAY');
}
/**
 * 根据商品ID去服务器-验证购买
 * @returns {string}
 */
function CheckPaybackGoosID() {
    Log.info('---------向服务器发包:根据商品ID去服务器-验证购买---------');
    // 0	成功	展示成功页面
    // -1	错误	可能的原因：签名错误、未注册APPID、项目设置APPID不正确、注册的APPID与设置的不匹配、其他异常等。
    // -2	用户取消	无需处理。发生场景：用户不支付了，点击取消，返回APP。
    if (!cc.sys.isNative || !cc.sys.isMobile) {
        Log.debug("---商品ID去服务器-验证购买----非手机 不验证 ---");
        return '';
    }
    var orderId = sgm.MethodsUtils.loadSavaLocalData('weChat_orderId');
    Log.debug(" --------- 验证orderId -------->"+orderId);
    var selfData = App.UserManager.getSelf();
    if (orderId && orderId.length > 1){
        var msg = {
            uid: selfData.uid,
            orderId: orderId,
        }
       Log.debug('\t\t把orderId值发送给服务器:'+JSON.stringify(msg));
        App.Http.postProto('lobby', '/wxCheckOrder', msg, 'ID_C2S_CHECK_ORDER');
        App.UIManager.showAwait();
    }
}
/**
 * 导出函数列表
 */
module.exports = {
    'getShopList': getShopList, //获取商城商品信息
    'getOrderList': getOrderList,//获取支付订单列表
    'send2ServerIOSCode': send2ServerIOSCode,//苹果支付单据
    'CheckPaybackGoosID': CheckPaybackGoosID,//根据商品ID去服务器-验证购买
}
