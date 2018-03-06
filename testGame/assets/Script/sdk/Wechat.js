/************************************************************************
 * Copyright (c) 2017 cardgame
 * Author    : Lee
 * Mail        : crazycode_lee@163.com
 * Date        : 2017-3-2
 * Use      : 微信sdk
 ************************************************************************/
var MD5 = require('md5');
var HttpOrderSendMsgs = require('HttpOrderSendMsgs');

function Wechat() {
    this.wechatCode = "";
    this.access_token = "";
    this.expires_in = "";
    this.refresh_token = "";
    this.openid = "";//用户的标识，对当前公众号唯一
    this.scope = "";
    this.unionid = "";//只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。

    this.vAppid = "wx294e4b87449777b3";// 应用ID
    this.secret = "347815d70bdd6752f9bd1beaf8f16284";
    this.nickname = "";//用户的昵称
    this.sex = 0;
    this.province = "";//省份
    this.city = "";//城市
    this.country = "";//国家
    this.headimgurl = "";
    this.privilege = "";

    this.finish_cb;
    this.wxIcon = null;
    this.package = 'com/men/games/ddz/wxapi/WXEntryActivity';

    // 微信支付
    this.api_key = "kelegamesdoudizhu112233woaikeles";

    this.partnerId		= "1486538032";  // 商户号
    this.prepayId		= "";  //预支付交易会话ID
    this.nonceStr		= "";  // 随机字符串
    this.timeStamp		= "";  // 时间戳
    this.packageValue	= "";
    this.sign			= "";  // 签名

    this.wechatPackage = 'Sign=WXPay';  // 扩展字段
    // this.mch_id = "1486538032";
};

Wechat.prototype.init = function () {
    Log.debug("-------微信init-------");
    this.initWeixin();
    reqToWeChatToken_cb = this._reqToWeChatToken.bind(this);
    reqWechatShareSuccess_cb = this.reqWechatShareSuccess.bind(this);
    reqWechatPayGoodsCalback_cb = this.reqWechatPayGoodsCalback.bind(this);
}

//< 初始化微信
Wechat.prototype.initWeixin = function () {
    Log.debug("-------初始化微信-------");
    //< 浏览器
    if (cc.sys.isNative) {
        if (cc.sys.os  == cc.sys.OS_ANDROID) {
            this.checkWechatClient = jsb.reflection.callStaticMethod(this.package, "initWeixin", "(Ljava/lang/String;)I", this.vAppid);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            this.checkWechatClient = jsb.reflection.callStaticMethod("WeChatManager", "initWeixin:", this.vAppid);
        }
    }
}

//< 请求登录微信
Wechat.prototype.loginWeixin = function (cb) {
    Log.debug("-------请求登录微信-------");
    var App = sgm.getSceneApp();
    if (!App) {
        Log.error('请求登录微信 GlobalData.setAppType');
    }
    if (this.checkWechatClient == 0) {
        Log.error("******************Wechat Error***********************微信客户端没装");
        {
            let string = "没有安装微信";
            let registerTipsPosition = cc.v2(0, 0);//弹出文字大小
            let registerTipsColor = cc.color(255, 255, 255);//弹出文字颜色
            let registerTipsFontSize = 26;//弹出文字大小
           App.UIManager.addTips(string, 1, registerTipsPosition, registerTipsColor, registerTipsFontSize, true, 4, true);
        }
        return;
    } else if (this.checkWechatClient == -1) {
        Log.error("******************Wechat Error***********************微信APPID出错");
        return;
    }

    this.finish_cb = cb;

    if(false){
        //< 从本地读取token
        this.access_token = sgm.MethodsUtils.loadSavaLocalData('access_token');
        this.refresh_token = sgm.MethodsUtils.loadSavaLocalData('refresh_token');
    }else{
        this.access_token='';
        this.refresh_token='';
    }

    Log.debug('==================== access_token ====' + this.access_token);
    Log.debug('==================== refresh_token =====' + this.refresh_token);
    if (this.access_token && this.access_token != "") {
        //< 检测token
        this._reqToWechatCheckAccesToken();
    } else {
        //< 授权请求
        this.AuthWechat();
    }
}

//< 授权请求
Wechat.prototype.AuthWechat = function () {
    Log.debug("******授权请求*******");
    //< 浏览器
    if (cc.sys.isNative) {
        if (cc.sys.os  == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.package, "loginWeixin", "(I)I", 3);
        }else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("WeChatManager", "sendAuthRequest");
        }
    }
}

//< 向微信请求检测token
Wechat.prototype._reqToWechatCheckAccesToken = function () {
    Log.debug("******向微信请求检测token*******");
    var App = sgm.getSceneApp();
    if (!App) {
        Log.error('向微信请求检测token GlobalData.setAppType');
    }

    var path = "https://api.weixin.qq.com/sns/auth?";
    var msg = {
        access_token: this.access_token,
        openid: this.openid,
    };
   App.Http.getJson(path, msg, function (resp) {
        Log.debug("=====_reqToWechatCheckAccesToken===" + resp.errcode);
        //< access_token检测对直接拿userinfo
        if (resp.errcode == 0) {
            this._reqToWechatUserInfo();
        }else { //< 失败就refresh token
            this._reqToWechatRefreshToken();
        }

    }.bind(this));
}

//< 向微信请求Token
Wechat.prototype._reqToWeChatToken = function (code) {
    Log.debug("******向微信请求Token*******");

    var App = sgm.getSceneApp();
    if (!App) {
        Log.error('向微信请求Token GlobalData.setAppType');
    }


    this.wechatCode = code;
    var path = "https://api.weixin.qq.com/sns/oauth2/access_token?";
    var msg = {
        appid: this.vAppid,
        secret: this.secret,
        code: this.wechatCode,
        grant_type: "authorization_code",
    }
   App.Http.getJson(path, msg, function (resp) {
        this.access_token = resp.access_token;
        this.expires_in = resp.expires_in;
        this.refresh_token = resp.refresh_token;
        this.openid = resp.openid;
        this.scope = resp.scope;
        this.unionid = resp.unionid;
        Log.debug("向微信请求Token" + JSON.stringify(resp));

        //< token保存到本地
        sgm.MethodsUtils.saveLocalData('access_token', this.access_token);
        sgm.MethodsUtils.saveLocalData('refresh_token', this.refresh_token);

        this._reqToWechatUserInfo();
    }.bind(this));
}

//< 向微信请求重置tokenA
Wechat.prototype._reqToWechatRefreshToken = function () {
    Log.debug("******向微信请求重置tokenA*******");

    var App = sgm.getSceneApp();
    if (!App) {
        Log.error('向微信请求重置tokenA GlobalData.setAppType');
    }


    var path = "https://api.weixin.qq.com/sns/oauth2/refresh_token?";
    var msg = {
        appid: this.vAppid,
        refresh_token: this.refresh_token,
        grant_type: "refresh_token",
    }

   App.Http.getJson(path, msg, function (resp) {
        Log.error("***************Wechat**********_reqToWechatRefreshToken*******AuthWEchat==" + resp.errcode);
        if (resp.errcode) {
            Log.error("***************Wechat**********_reqToWechatRefreshToken*******AuthWEchat");
            this.AuthWechat();
        } else {
            this.access_token = resp.access_token;
            this.expires_in = resp.expires_in;
            this.refresh_token = resp.refresh_token;
            this.openid = resp.openid;
            this.scope = resp.scope;

            //< token保存到本地
            sgMethods.MethodsUtils.saveLocalData('access_token', this.access_token);
            sgMethods.MethodsUtils.saveLocalData('refresh_token', this.refresh_token);
            Log.debug("========================================reqToWechatRefreshToeken=>" + resp + "\n");
            this._reqToWechatUserInfo();
        }
    }.bind(this));
}


//< 向微信请求玩家信息
Wechat.prototype._reqToWechatUserInfo = function () {
    Log.debug("----------向微信请求玩家信息----------");
    var path = "https://api.weixin.qq.com/sns/userinfo?";

    var App = sgm.getSceneApp();
    if (!App) {
        Log.error('向微信请求玩家信息 GlobalData.setAppType');
    }

    var msg = {
        access_token: this.access_token,
        openid: this.openid,
    }
   App.Http.getJson(path, msg, function (resp) {
        // resp = JSON.stringify(resp);
        this.openid = resp.openid;
        this.nickname = resp.nickname;

        if(parseInt(resp.sex) == 2 ){//微信返回-没有性别0,男1,女2,  ---自己设置 0男，1女
            this.sex = 1;
        }else{
            this.sex = 0;
        }
        Log.debug("返回微信性别:" + resp.sex);
        Log.debug("自己设置微信性别:" + this.sex);

        this.province = resp.province;
        this.city = resp.city;
        this.country = resp.country;
        this.headimgurl = resp.headimgurl;
        this.privilege = resp.privilege;
        this.unionid = resp.unionid;
        Log.debug("\t向微信请求玩家信息:" + JSON.stringify(resp));
        this.finish_cb();
    }.bind(this));
}

/**
 * 获取微信头像
 * @param cb 头像回调函数
 * @param isIcon 是否使用缓存头像
 */
Wechat.prototype.getIcon = function (cb, isIcon = true) {
    Log.debug("----------获取微信头像----------");
    if (isIcon) {
        if (this.wxIcon) {
            cb(this.wxIcon);
            return;
        }
    }
    var tmp_url = this.headimgurl;
    if (!tmp_url || tmp_url == "") {//没有头像的话！就设置一个默认头像->"resources/icon.png"
        tmp_url = "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0";
        cc.loader.loadRes('icon', cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                Log.error('微信加载本地头像失败：' + err.message || err);
                return;
            }
            this.wxIcon = spriteFrame;
            cb(spriteFrame);
        }.bind(this));
        return;
    }
    let wechatp = sgm.MethodsUtils.loadSavaLocalData(sgc.StorageConst.LoginStorage.WECHAT_PASSWORD_OBJECT);
    if (wechatp) {//微信记录密码问题
        // tmp_url += (".png");
    }else{
        // tmp_url = tmp_url.slice(0, tmp_url.length - 1);
        // tmp_url +=("132");
        var num = tmp_url.lastIndexOf("/");
        tmp_url = tmp_url.slice(0, num + 1);
        tmp_url +=("132");
    }
    Log.debug('获取头像Wechat 保存记录:'+wechatp+'\turl:'+tmp_url);
    cc.loader.load({url: tmp_url, type: 'png'}, function (err, tex) {
        if (err) {
            Log.error('微信加载网络头像失败：'+ err.message || err);
            this.headimgurl = '';
            this.getIcon(cb, false);
            return;
        }
        this.wxIcon = tex;
        cb(tex);
    }.bind(this));
}

//< 文字分享
Wechat.prototype.sendTextContent = function (str) {
    Log.debug("----------微信文字分享----------");
    if(this.weChatError()){// 无微信或者APPID出错
        return;
    }
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            Log.debug("----------微信分享---ios-------");
            jsb.reflection.callStaticMethod("WeChatManager", "sendTextContent:SSession:", str, "0");
        } else if (cc.sys.OS_ANDROID == cc.sys.os) {
            Log.debug("----------微信分享---android-------");
            jsb.reflection.callStaticMethod(this.package, "sendTextContent", "(Ljava/lang/String;Ljava/lang/String;)V", str, "0");
        }
    }
}

//< 发送图片
Wechat.prototype.sendImageContent = function (path) {
    Log.debug('----------发送图片----------');
    if(this.weChatError()){// 无微信或者APPID出错
        return;
    }
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("WeChatManager", "sendImageContent:", path);
        } else if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod(this.package, "sendIMageContent", "(Ljava/lang/String;)V", path);
        }
    }
}
//< 链接分享
Wechat.prototype.sendAppContent = function (url, title, description, type, cb) {
    Log.debug('----------微信链接分享----------');
    if(this.weChatError()){// 无微信或者APPID出错
        return;
    }
    if (!type) {// 分享类型，好友还是朋友圈
        type = "0";
    }
    if (!cb) {// 回调方法
        cb = "";
    }
    if (cc.sys.isNative) {
        if (cc.sys.os == cc.sys.OS_IOS) {
            try {
                jsb.reflection.callStaticMethod("WeChatManager", "sendLinkContentWithsendLinkURL:Title:Description:Scene:Callback:", url, title, description, type, cb);
            } catch (error) {
                jsb.reflection.callStaticMethod("WeChatManager", "sendLinkContentWithsendLinkURL:Title:Description:", url, title, description);
            }
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.package, "sendWebPage", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", url, title, description, type, cb);
        }
    }
}

/**
 * 微信是否出错（手机没有微信、微信ID错误）
 * 出错，返回true，不出错，返回false
 */
Wechat.prototype.weChatError = function () {
    Log.debug('--------微信是否出错(手机没有微信、微信ID错误)------' + this.checkWechatClient);

    var App = sgm.getSceneApp();
    if (!App) {
        Log.error('微信是否出错(手机没有微信、微信ID错误) GlobalData.setAppType');
    }


    let vstring = "没有安装微信";
    if (this.checkWechatClient == 0) {
        Log.error("******************Wechat Error***********************微信客户端没装");
        {
            vstring = "没有安装微信";
            let registerTipsPosition = cc.v2(0, 0);//弹出文字大小
            let registerTipsColor = cc.color(255, 255, 255);//弹出文字颜色
            let registerTipsFontSize = 26;//弹出文字大小
           App.UIManager.addTips(vstring, 1, registerTipsPosition, registerTipsColor, registerTipsFontSize, true, 4, true);
           App.UIManager.hideAwait();
        }
        return true;
    } else if (this.checkWechatClient == -1) {
        Log.error("******************Wechat Error***********************微信APPID出错");
        {
            vstring = "微信AppId授权出错";
            let registerTipsPosition = cc.v2(0, 0);//弹出文字大小
            let registerTipsColor = cc.color(255, 255, 255);//弹出文字颜色
            let registerTipsFontSize = 26;//弹出文字大小
           App.UIManager.addTips(vstring, 1, registerTipsPosition, registerTipsColor, registerTipsFontSize, true, 4, true);
           App.UIManager.hideAwait();
        }

        return true;
    }
    return false;
}

/**
 * 微信分享成功回调
 */
Wechat.prototype.reqWechatShareSuccess = function (code) {// 这里是一个字符串
    var App = sgm.getSceneApp();
    if (!App) {
        Log.error('微信分享成功回调 GlobalData.setAppType');
    }


    Log.debug("=================微信分享成功回调=================分享位置：" + code);
    var currScene = cc.director.getScene();
    Log.debug('=================微信分享成功回调=================sceneName为     ' + currScene.name);
    if (currScene && currScene.name == 'lobby') {// 当前在大厅，才设置分享状态，否则不设置
       App.GlobalData.setShareState(1);// 分享成功，设置为1
    } else if (currScene && currScene.name == 'PyLobby'){
        Log.debug('=================微信分享成功回调=================当前场景为PyLobby');
       App.GlobalData.setShareState(1);// 分享成功，设置为1
       App.GlobalData.setShareType(code);// 分享成功，设置为1
    }
}
/*
* 微信 购买
* orderId     //订单号
* chargePoint //计费点
* */
Wechat.prototype.payGoods = function (wxConfig) {
    Log.debug('----------- 微信js 调用 底层开始----------');
    if(this.weChatError()){// 无微信或者APPID出错
        return;
    }
 
    if (cc.sys.os == cc.sys.OS_IOS){
        jsb.reflection.callStaticMethod("WeChatManager", "jumpToWxPay:partnerId:prepayId:package:nonceStr:timeStamp:sign:", wxConfig.appid,
            wxConfig.partnerid, wxConfig.prepayid, wxConfig.package, wxConfig.noncestr, wxConfig.timestamp, wxConfig.sign);
    } else if (cc.sys.os == cc.sys.OS_ANDROID){
        jsb.reflection.callStaticMethod(this.package, "WeCatPay", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;" +
            "Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", wxConfig.appid,
            wxConfig.partnerid, wxConfig.prepayid, wxConfig.package, wxConfig.noncestr, wxConfig.timestamp, wxConfig.sign, "wechatPayGoodsCallback_cb");
    }
    //应用ID,商户号,预支付交易会话ID,扩展字段,/随机字符串,时间戳,签名
}
/**
 * 微信购买成功回调
 */
Wechat.prototype.reqWechatPayGoodsCalback = function (eCode) {
    var App = sgm.getSceneApp();
    if (!App) {
        Log.error('微信购买成功回调 GlobalData.setAppType');
    }

    Log.debug("=================微信购买  结果 回调================= ：" + eCode);
    // 0	成功	展示成功页面
    // -1	错误	可能的原因：签名错误、未注册APPID、项目设置APPID不正确、注册的APPID与设置的不匹配、其他异常等。
    // -2	用户取消	无需处理。发生场景：用户不支付了，点击取消，返回APP。

    // HttpOrderSendMsgs.CheckPaybackGoosID(eCode)  // 因为购买后会触发断线重连 这个时候会检查 购买是否成功
    //  App.GlobalConfig.onceLobbyLoad = true
    sgm.MethodsUtils.saveLocalData("weChat_checkCode", 11)
}
/*
* 生成随机字符串
* */
Wechat.prototype.randomString = function (len) {
    Log.debug("--------生成随机字符串--------");
    var ilen = len || 32;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = chars.length;
    var pwd = '';
    for (let i = 0; i < ilen; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    Log.debug("\t数据"+pwd);
    return pwd;
}

module.exports = new Wechat();