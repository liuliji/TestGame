/************************************************************************
 * Copyright (c) 2017 cardgame
 * Author	: Lee
 * Mail		: crazycode_lee@163.com
 * Date		: 2017-3-2
 * Use      : oc或者java层理返回到js层的回调都放这里
************************************************************************/

window.reqToWeChatToken_cb = null;
window.reqWechatShareSuccess_cb = null;// 微信分享成功回调
window.reqWechatPayGoodsCalback_cb = null; // 微信分享支付回调
window.YV_onLoginListern_cb = null;
window.YV_onStopRecordListern_cb = null;
window.YV_onUpLoadFileListern_cb = null;
window.YV_onFinishPlayListern_cb = null;
window.HomeBack_cb = null;
window.reqIOSFinish_cb = null; //iOS支付结束回调（成功以外的情况）
window.reqIOSPurchaseSuccess_cb = null; //iOS支付成功回调
window.GD_reqGaodeMap_cb = null; // 高德地图 回调方法



//< 微信登录特权返回
function wechatRecvAuth_cb(code) {
    Log.debug("=====WechatRecvAuthCallback======Code====" + code);
    reqToWeChatToken_cb(code);
}
// 微信分享成功
function wechatShareSuccess_cb(code){
    Log.debug("=========WechatShareCallback=============");
    reqWechatShareSuccess_cb(code);
}
//微信支付回调
function wechatPayGoodsCallback_cb(code){
    Log.debug("=========微信支付回调=============");
    reqWechatPayGoodsCalback_cb(code);
}
//< 云娃登录回调
function YV_onLoginListern( result,msg,userid,nickName,iconUrl,thirdUserId,thirdUserName )
{
    Log.debug("=====云娃登录回调======");
    YV_onLoginListern_cb( result,msg,userid,nickName,iconUrl,thirdUserId,thirdUserName );
}

//< 云娃录音完毕回调
function YV_onStopRecordListern( time,strfilepath,ext )
{
    Log.debug("=====云娃录音完毕回调======");
    YV_onStopRecordListern_cb( time,strfilepath,ext );
}

//< 上传文件成功回调
function YV_onUpLoadFileListern( result,msg,fileid,fileurl,percent )
{
    Log.debug("=====上传文件成功回调======");
    YV_onUpLoadFileListern_cb( result,msg,fileid,fileurl,percent );
}

//< 上传文件成功回调
function YV_onFinishPlayListern( result,describe,ext )
{
    Log.debug("=====上传文件成功回调======");
    YV_onFinishPlayListern_cb( result,describe,ext );
}

//< Home键返回界面回调
function HomeBack()
{
    if( HomeBack_cb != null ){
        HomeBack_cb();
    }
}

//< iOS支付成功回调
function iOSPurchaseSuccess_cb(produceId,code) {
    Log.debug("=====iOS支付成功回调======Code====" + code);
    reqIOSPurchaseSuccess_cb(produceId,code);
}

//iOS支付结束回调（成功以外的情况）
function iOSPurchaseFinish_cb(code) {
    Log.debug("=====iOS支付结束回调======Code====" + code);
    reqIOSFinish_cb(code);
}

//高德地图回调注册回调函数
function GD_reqGaodeMap_cbListern(code1, code2, code3) {
    Log.debug("=====高德地图回调注册回调函数======");
    GD_reqGaodeMap_cb(code1, code2, code3);
}

function __errorHandler(error,line,msg){

    var writablePath = jsb.fileUtils.getWritablePath();
    var fileName = "log.txt";
    var dataStr = "cocos js error:"+error+" :line"+line+": "+msg;
    var fullPath = writablePath + fileName;
    jsb.fileUtils.writeStringToFile(dataStr, fullPath);
}
