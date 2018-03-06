window.g_METHODS = null;

function SgMethods() {
    this.MethodsUtils = require('MethodsUtils');
    this.RandomUtils = require('RandomUtils');
    this.Util = require('Util');

    this.StandAgencyType=0;//战绩或代开类型 1战绩，2代开,默认0

    this.logInInfo = null;

    //游戏序号--这个值不是固定值
    this.gameAppId = {
        DDZ: 1001,
        PY: 1002,
    };

    //游戏类型--这个值是固定值
    this.gameAppType={
        DDZ:4,
        PY:6,
    };

    this.applist = null;
}


/**
 * 获取场景名字
 * @returns {null}
 */
SgMethods.prototype.getSceneName = function () {
    var currScene = cc.director.getScene();
    if (currScene) {
        var vname = currScene.name;
        return vname;
    }
    return null;
};

SgMethods.prototype.getSceneApp = function () {
    var vSceneName = this.getSceneName();
    var vApp = null;
    // Log.debug('---AAA:'+JSON.stringify(vSceneName));
    // if (vSceneName) {
    //     if (vSceneName == 'PyGame' || vSceneName == 'PyLobby' || vSceneName == 'PyLogin' || vSceneName == 'PyLoginGM') {
    //         vApp = require('PyApp');
    //     } else {
    //         vApp = require('App');
    //     }
    //     // Log.debug('---BBB:'+JSON.stringify(vSceneName));
    //     // cc.warn('场景名字是:' + vSceneName + '\tApp名字:' + vApp.vName);
    // } else {
    //     vApp = require('App');
    // }
    vApp = require('App');
    // Log.debug('---CCC:'+JSON.stringify(vApp));
    return vApp;
};

SgMethods.prototype.setLogInInfo = function (args) {
    if (!this.logInInfo) {
        this.logInInfo = {};
    }
    if (args.token) {
        this.logInInfo.token = args.token;
        var vSceneName = this.getSceneName();
        // cc.warn(vSceneName+' 设置游戏App名字:' + args.token);
    }
    if (args.host) {
        this.logInInfo.http = args.host;
    }
    if (args.hostWs) {
        this.logInInfo.ws = args.hostWs;
    }
    var vType = typeof (args.type);
    if (vType == 'number') {//登录类型 0:游客,1:微信,2手机注册,3手机登录,4gm
        Log.warn('-----设置登录信息:'+args.type);
        this.logInInfo.type = args.type;
    }
};

SgMethods.prototype.getLogInInfo = function (args) {
    return this.logInInfo;
};

SgMethods.prototype.setApplist = function (args) {
    this.applist = args;
};

SgMethods.prototype.getApplist = function () {
    return this.applist;
};


SgMethods.getInstance = function () {
    if (!g_METHODS)
        g_METHODS = new SgMethods();
    return g_METHODS;
};

window.sgMethods = SgMethods.getInstance();
window.sgm = window.sgMethods;

