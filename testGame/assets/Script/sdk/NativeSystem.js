// var App = require('App');
var GlobalData = require('GlobalData');

/**
 * 获取打开应用URL
 * 获取应用打开的链接(房间跳转使用)
 *  http://blog.csdn.net/u013152587/article/details/71374706
 * @returns {string}
 */
function getOpenAppUrl() {
    //Log.debug('-------获取打开应用URL-------');
    if (!cc.sys.isNative || !cc.sys.isMobile) return '';

    var openAppUrl = "";
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        openAppUrl = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getOpenAppUrl", "()Ljava/lang/String;");
    } else if (cc.sys.os == cc.sys.OS_IOS) {
        openAppUrl = jsb.reflection.callStaticMethod("AppController", "getOpenAppUrl");
    }

    return openAppUrl;
}

/**
 * 获取电池电量
 * @returns {number}
 */
function getElectricQuantity() {
    // Log.debug('==========获取电池电量============');
    var electricQuantity = 0;
    if (!cc.sys.isNative || !cc.sys.isMobile) {
        return electricQuantity;
    }
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        electricQuantity = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getElectricQuantity", "()F");
    } else if (cc.sys.os == cc.sys.OS_IOS) {
        electricQuantity = jsb.reflection.callStaticMethod("LocationManager", "getElectricQuantity");
    }
    return electricQuantity;
}

/**
 * 获取网络状态
 * @returns {number}
 */
function getNetWorkStat() {
    if (!cc.sys.isNative) {
        return;
    }
    var stat = 1;
    if (cc.sys.OS_ANDROID == cc.sys.os) {
        stat = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getNetWorkState", "()I");
    } else if (cc.sys.OS_IOS == cc.sys.os) {
        stat = jsb.reflection.callStaticMethod("WeChatManager", "getNetWorkState");
    }
    return stat;
}

/**
 * 获取设备的uuid
 * @returns {string}
 */
function getUUID() {
    Log.debug('==========获取设备的uuid============');
    var uuid = 'none';
    if (!cc.sys.isNative || !cc.sys.isMobile) {
        return uuid;
    }
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        uuid = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getUUID", "()Ljava/lang/String;");
    } else if (cc.sys.os == cc.sys.OS_IOS) {
        uuid = jsb.reflection.callStaticMethod("LocationManager", "getUUID");
    }
    return uuid;
}

/**
 * 复制到系统粘贴板上
 * @param tpNum 复制的字符串
 * @returns {*}
 */
function copySystemDuplicatePlate(copyString) {
    Log.debug('------------复制到系统粘贴板上------------>' + copyString);
    var result = false;
    if (!cc.sys.isNative || !cc.sys.isMobile) {
        return result;
    }

    if (cc.sys.os == cc.sys.OS_ANDROID) {
        result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/ClipboardUtil", "clipboardCopyText", "(Ljava/lang/String;)V", copyString);
    } else if (cc.sys.os == cc.sys.OS_IOS) {
        result = jsb.reflection.callStaticMethod("LocationManager", "clipboardCopyText:", copyString);
    }
    return result;
}
/**
 * 打电话
 * @param phone
 * @returns {null}
 */
function callPhone(phone) {
    Log.debug('------------打电话------------');
    if (!cc.sys.isNative) {
        return null;
    }
    // Log.debug("\t\t0000");
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        // Log.debug("\t\tandroid");
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "callPhone", "(Ljava/lang/String;)V", phone);
    } else if (cc.sys.os == cc.sys.OS_IOS) {
        // Log.debug("\t\tios");
        jsb.reflection.callStaticMethod("LocationManager", "callPhone:", phone);
    }
    return null;
}
/**
 * 创建地图视图
 * @param x
 * @param y
 * @param width
 * @param height
 * @param name
 */
function creatMapView(x, y, width, height, name) {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("AppController", "creatMapView:sety:setWidth:setHeight:setName:", x, y, width, height, name);
    }
}
/**
 * 销毁地图视图
 */
function destroyMapView() {
    if (GlobalData.measurementType == 0) {//测试服屏蔽

    } else if (GlobalData.measurementType == 1) {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AppController", "destroyMapView");
        }
    }
}

/**
 * 系统奔溃日志
 * @returns {string}
 */
function sysBreakdownLog() {
    var errorLog = "";
    if (GlobalData.measurementType == 1) {//测试服屏蔽
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            errorLog = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sysBreakdownLog", "()Ljava/lang/String;");
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            //errorLog=jsb.reflection.callStaticMethod("CatchCrash", "sysBreakdownLog");
        }
    }

    if (cc.sys.isNative){
        let dirpath = jsb.fileUtils.getWritablePath();
        let fileName = "log.txt";
        var fullPath = dirpath + fileName;
        var readData = jsb.fileUtils.getStringFromFile(fullPath);
        errorLog += readData;
    }

    return errorLog;
}


/**
 * 导出函数列表
 */
module.exports = {
    'getOpenAppUrl': getOpenAppUrl,  //获取打开应用URL
    'getElectricQuantity': getElectricQuantity,  //获取电池电量
    'getNetWorkStat': getNetWorkStat,  //获取网络状态
    'getUUID': getUUID,//获取设备的uuid
    'copySystemDuplicatePlate': copySystemDuplicatePlate,//复制到系统粘贴板上
    'callPhone': callPhone,//打电话
    'creatMapView': creatMapView,//创建地图视图
    'destroyMapView': destroyMapView,//销毁地图视图
    'sysBreakdownLog': sysBreakdownLog,//系统奔溃日志
};