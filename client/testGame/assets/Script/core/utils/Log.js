/************************************************************************
 * Copyright (c) 2016 App
 * Author      : liuliji
 * Mail        : liuliji1184899343@163.com
 * Date        : 2017-04-07
 * Use         : 打印log
 ************************************************************************/
window.tmpLog = null;
function CLog() {
    this.engineVersion = 0;//引擎版本(creator版本)
    this.sceneLog = {};//场景日志
    this.isShowTitle = true;//是否显示log的类型(none,error,warn,info,debug);
    this.showTitle = ['none', 'error', 'warn', 'info', 'log', 'debug'];
    this.gameLogType = {
        NONE: 0,   //什么都不打印
        ERROR: 1,   //打印error及以上，其实最高就是error
        WARN: 2,   //打印warn及以上
        INFO: 3,   //打印info及以上
        LOG: 4,   //打印log及以上
        DEBUG: 5,   //打印debug及以上
    };

    this.logUneHistoireNumber = 1000;//日志历史条目
    this.logObject = console || cc;
    this.onlyShowLogType = this.gameLogType.NONE;//只显示某一类日志(例如info,只能显示info的日志，像debug,error...都不显示了)

    // this.logType = this.gameLogType.NONE;
    this.logType = this.gameLogType.DEBUG;
};

CLog.getInstance = function () {
    if (!tmpLog) {
        tmpLog = new CLog();
    }
    return tmpLog;
};
/**
 * 设置log对象(console || cc)
 * @param type 日志对象
 */
CLog.prototype.setLogObject = function (obj) {
    this.logObject = obj;
};
/**
 * 设置日志类型
 * @param type
 */
CLog.prototype.setLogType = function (type) {
    this.logType = type;
};
/**
 * 只显示指定类型日志
 * @param type
 */
CLog.prototype.setOnlyShowLogType = function (type) {
    this.onlyShowLogType = type;
};
/**
 * 否显示日志标签(例如debug:'输出的内容',debug显示或不显示)
 * @param isTrue
 */
CLog.prototype.isLogTitle = function (isTrue) {
    this.isShowTitle = isTrue;
};
CLog.prototype.info = function (obj) {
    var vSubst = this.setArguments(arguments);
    this.showContent(obj, vSubst, this.gameLogType.INFO);
};
CLog.prototype.warn = function (obj) {
    var vSubst = this.setArguments(arguments);
    this.showContent(obj, vSubst, this.gameLogType.WARN);
};
CLog.prototype.debug = function (obj) {
    var vSubst = this.setArguments(arguments);
    this.showContent(obj, vSubst, this.gameLogType.DEBUG);
};
CLog.prototype.error = function (obj) {
    var vSubst = this.setArguments(arguments);
    this.showContent(obj, vSubst, this.gameLogType.ERROR);
};
CLog.prototype.log = function (obj) {
    var vSubst = this.setArguments(arguments);
    this.showContent(obj, vSubst, this.gameLogType.LOG);
};
CLog.prototype.setArguments = function (valueArgument) {//参数修整
    var vString = [];
    var argumentCount = valueArgument.length;
    if (argumentCount >= 1) {
        for (var i = 1; i < argumentCount; i++) {
            vString.push(valueArgument[i] + '');
        }
    }
    return vString.length >= 1 ? vString : undefined;
};
CLog.prototype.getTitle = function (logType) {
    var title = (this.isShowTitle) ? (this.showTitle[logType] + ":") : '';

    if (this.engineVersion == 0) {
        var vcv = cc.ENGINE_VERSION;
        var vArray = vcv.split('.');
        var ivArry = [100, 10, 1];
        var value = 0;
        var ivCount = vArray.length;
        for (var i = 0; i < ivCount; i++) {
            value += vArray[i] * ivArry[i];
        }
        this.engineVersion = value;//引擎版本(creator版本)
    }
    if (this.engineVersion >= 150) {//1.5.0版本
        title = 'cocos2dx ' + title;
    }

    return title;
};
/**
 * @param obj 显示的内容
 * @param subst 逗号后面的参数(一般是数组或undefined)
 * @param logType 日志类型标题
 */
CLog.prototype.showContent = function (obj, subst, logType) {
    var showString = '';
    var vLogType = this.getTitle(logType);
    var vTypeof = typeof (subst);
    // console.log('输出的类型是:' + vTypeof);
    if (vTypeof == 'undefined') {
        showString = vLogType + obj;
    } else {
        // debugger;
        var vArrStr = obj;
        var index = 0;
        var jlArr = vArrStr.split('%');
        var iJlArr = jlArr.length;
        if (iJlArr == 1) {//没有特殊字符
            var iArray = subst.length;
            for (var i = 0; i < iArray; i++) {
                vArrStr += subst[i];
            }
        } else if (iJlArr > 1) {//特殊字符处理
            for (var i = 0; i < iJlArr; i++) {
                var temp = (subst[index]) ? (subst[index]) : '';
                vArrStr = vArrStr.replace(/%\d{0,}[c|d|i|e|f|g|o|s|x|p|n|u]/, temp);
                index++;
            }
        }
        showString = vLogType + vArrStr;
    }
    this.outLog(showString, logType);
    this.setSceneLog(showString);
};
/**
 * 输出显示的内容
 * @param vsContent 显示的内容
 * @param vsType 显示的类型
 */
CLog.prototype.outLog = function (vsContent, vsType) {
    if (this.onlyShowLogType == this.gameLogType.NONE || this.onlyShowLogType == this.gameLogType.DEBUG) {
        if (true) {
            if (this.logType !== this.gameLogType.NONE) {
                switch (vsType) {
                    case this.gameLogType.NONE:
                        break;
                    case this.gameLogType.ERROR:
                        cc.error(vsContent);
                        break;
                    case this.gameLogType.WARN:
                        cc.warn(vsContent);
                        break;
                    case this.gameLogType.LOG:
                    case this.gameLogType.INFO:
                    case this.gameLogType.DEBUG:
                        this.logObject.log(vsContent);
                        break;
                }
            }
        } else {
            if (this.logType !== this.gameLogType.NONE) {
                if (vsType == this.gameLogType.WARN) {
                    cc.warn(vsContent);
                } else if (vsType == this.gameLogType.ERROR) {
                    cc.error(vsContent);
                } else {//正常日志
                    this.logObject.log(vsContent);
                }
            }
        }
    } else {//只显示指定类型内容
        if (this.onlyShowLogType == vsType) {
            switch (vsType) {
                case this.gameLogType.NONE:
                    break;
                case this.gameLogType.ERROR:
                    cc.error(vsContent);
                    break;
                case this.gameLogType.WARN:
                    cc.warn(vsContent);
                    break;
                case this.gameLogType.LOG:
                    this.logObject.log(vsContent);
                    break;
                case this.gameLogType.INFO:
                    this.logObject.log(vsContent);
                    break;
                case this.gameLogType.DEBUG:
                    this.logObject.log(vsContent);
                    break;
            }
        }
    }

};


/**
 * 场景日志初始化
 */
CLog.prototype.sceneLogInit = function () {
    this.sceneLog = {};
};
/**
 * 设置场景日志
 * @param log
 */
CLog.prototype.setSceneLog = function (vLog) {
    var sceneName = this.getSceneName();
    if (sceneName) {
        var vname = sceneName;
        var fgf = '\n';
        if (true) {
            if (this.sceneLog['' + vname]) {
                var iCount = this.sceneLog['' + vname].length;
                if (iCount < this.logUneHistoireNumber) {
                    this.sceneLog['' + vname].push((vLog + fgf));
                } else {
                    var vD = this.sceneLog['' + vname].shift();
                    // console.log('\t\t\t当前条目:'+iCount+' 历史条目:'+this.logUneHistoireNumber+' 弹出的日志是:'+vD );
                    this.sceneLog['' + vname].push((vLog + fgf));
                }
            } else {
                this.sceneLog['' + vname] = [];
                this.sceneLog['' + vname].push((vLog + fgf));
            }
        } else {
            if (this.sceneLog['' + vname]) {
                this.sceneLog['' + vname] += (vLog + fgf);
            } else {
                this.sceneLog['' + vname] = '';
                this.sceneLog['' + vname] += (vLog + fgf);
            }
        }
    }
};
/**
 * 获取全部场景日志
 */
CLog.prototype.getSceneLog = function () {
    return this.sceneLog;
};
/**
 * 显示场景日志
 * @param sceneName 场景名字
 */
CLog.prototype.showSceneLog = function (sceneName) {
    if (this.sceneLog['' + sceneName]) {
        this.logObject.log('场景' + sceneName + '日志:' + JSON.stringify(this.sceneLog['' + sceneName]));
    } else {
        this.logObject.log('没有场景' + sceneName + '日志:');
    }
};

/**
 * 获取场景名字
 * @returns {null}
 */
CLog.prototype.getSceneName = function () {
    var currScene = cc.director.getScene();
    if (currScene) {
        var vname = currScene.name;
        return vname;
    }
    return null;
};

window.Log = CLog.getInstance();
window.log = window.Log;