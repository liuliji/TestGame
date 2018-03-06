/************************************************************************
 * Copyright (c) 2017 cardgame
 * Author    : Lee
 * Mail      : crazycode_lee@163.com
 * Date      : 2017-3-31
 * Use       : 定位sdk
 ************************************************************************/



function LocationSDK() {
    this.isOnOffGps = false;
    this.place = '未获取到用户地理位置信息';
    this.detailedPlace = null;
};

/**
 * GPS定位是否开启
 */
LocationSDK.prototype.isOpenGps = function () {
    Log.debug('--------判断玩家是否开启了GPS定位----------');
    if (!cc.sys.isNative || !cc.sys.isMobile) return false;

    if (cc.sys.os == cc.sys.OS_ANDROID) {
        this.isOnOffGps = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getGpsOpen", "()Z");
    } else if (cc.sys.os == cc.sys.OS_IOS) {
        this.isOnOffGps = jsb.reflection.callStaticMethod("LocationManager", "getGpsOpen");
    }
    Log.debug('GPS定位开关:'+ this.isOnOffGps);


    var App = sgm.getSceneApp();
    if (!App) {
        Log.error('isOpenGps GlobalData.setAppType');
    }

    if(App.GlobalData.GMType==1){//0[正常游戏],1[gm工具]
        this.isOnOffGps=true;  //GM工具代码
    }

    return this.isOnOffGps;
}

/**
 * gps初始化
 * @returns {string}
 */
LocationSDK.prototype.locationInit = function () {
    var isOpenGps = this.isOpenGps();
    Log.debug('-------gps初始化------gps开关:'+isOpenGps);
    if (!cc.sys.isNative || !cc.sys.isMobile){ return '';}
    if (cc.sys.os == cc.sys.OS_ANDROID ) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "initLocation", "()V");
    } else if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("LocationManager", "initLocation");
    }
    Log.debug('-------gps初始化------Ok---');

    GD_reqGaodeMap_cb = this.reqGaodeMap_cback.bind(this);
    return '';
};

//注册 高德地图 回调函数
LocationSDK.prototype.reqGaodeMap_cback = function (px, py, pc) {
    Log.debug("注册 高德地图 回调函数   " + px + "----" + py + "----" + pc);
};

/**
 * 获取详细地理位置信息
 * @returns {*}
 */
LocationSDK.prototype.getPlace = function () {
    Log.debug('----------注册从java/ios获取用户的位置信息----------');
    if (!cc.sys.isNative || !cc.sys.isMobile) return this.place;
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        this.place = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getStringPlace", "()Ljava/lang/String;");
    } else if (cc.sys.os == cc.sys.OS_IOS) {
        this.place = jsb.reflection.callStaticMethod("AppController", "getClientPlace")
    }

    if (!this.place || this.place == "" || this.place == undefined) {
        this.place = '未获取到用户的位置信息！';
    }

    var App = sgm.getSceneApp();
    if (!App) {
        Log.error('getPlace GlobalData.setAppType');
    }

    if(App.GlobalData.GMType==1) {//0[正常游戏],1[gm工具]
        this.place = '未获取到用户的位置信息';  //GM工具代码
    }
    Log.debug("\t获取详细地理位置信息:" + this.place);
    return '' + this.place;
};

/**
 * 获取详细地理位置信息
 * @returns {*}
 */
LocationSDK.prototype.getDetailedPlace = function () {
    Log.debug('-----------注册从java／ios 获取详细地理位置信息 getDetailedPlace-----------');
    if (!cc.sys.isNative || !cc.sys.isMobile) return this.place;
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        this.detailedPlace = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getDetailedPlace", "()Ljava/lang/String;");
    } else if (cc.sys.os == cc.sys.OS_IOS) {
        this.detailedPlace = jsb.reflection.callStaticMethod("AppController", "getDetailedPlace")
    }

    var App = sgm.getSceneApp();
    if (!App) {
        Log.error('getDetailedPlace GlobalData.setAppType');
    }

    if(App.GlobalData.GMType==1) {//0[正常游戏],1[gm工具]
        this.detailedPlace='未获取到用户的位置信息';
    }
    Log.debug("获取详细地理位置信息A:" + this.detailedPlace);
    return '' + this.detailedPlace;
};

/**
 * 获取高德经纬度
 * @param reTq 是否从新定位 true重新定位,false不重新定位
 * @returns {{longitude: string, latitude: string}}
 */
LocationSDK.prototype.getAutaNaviLongitudeLatitude = function (reTq) {
    Log.debug('-----------getAutaNaviLongitudeLatitude-----------'+reTq);
    let  longitudeLatitude='';
    if (cc.sys.os == cc.sys.OS_ANDROID ) {
        longitudeLatitude = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getAutaNaviLongitudeLatitude", "()Ljava/lang/String;");
        if (reTq) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "reGetGdGPS", "()V");
        }
        // 跟新 玩家经纬度
    } else if (cc.sys.os == cc.sys.OS_IOS) {
        longitudeLatitude = jsb.reflection.callStaticMethod("LocationManager", "getAutaNaviLongitudeLatitude");
        if (reTq) {
            jsb.reflection.callStaticMethod("AppController", "reGetGdGPS");
        }
    }
    var rejs={
        longitude:'',
        latitude:''
    };
    let ArrayString=longitudeLatitude.split(',');
    if(ArrayString){
        let count=ArrayString.length;
        if(count>=2){
            for(let i=0;i<count;i++){
                if(i==0) {
                    rejs.longitude = parseFloat(ArrayString[i]);
                }else if(i==1){
                    rejs.latitude = parseFloat(ArrayString[i]);
                }
            }
        }
    }

    var App = sgm.getSceneApp();
    if (!App) {
        Log.error('getAutaNaviLongitudeLatitude GlobalData.setAppType');
    }

    if(App.GlobalData.GMType==1) {//0[正常游戏],1[gm工具]
        rejs={ longitude:''+0, latitude:''+0 }; //GM工具代码
    }

    return rejs;
};
/**
 * 获取系统本身经纬度
 * @returns {{longitude: string, latitude: string}}
 */
LocationSDK.prototype.getFacilityLongitudeLatitude = function () {
    Log.debug('-----------getFacilityLongitudeLatitude-----------');
    let  longitudeLatitude='';
    if (cc.sys.os == cc.sys.OS_ANDROID ) {
        longitudeLatitude = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getFacilityLongitudeLatitude", "()Ljava/lang/String;");
    } else if (cc.sys.os == cc.sys.OS_IOS) {
        longitudeLatitude = jsb.reflection.callStaticMethod("LocationManager", "getFacilityLongitudeLatitude");
    }

    var rejs={
        longitude:'',
        latitude:''
    };
    let ArrayString=longitudeLatitude.split(',');
    if(ArrayString){
        let count=ArrayString.length;
        if(count>=2){
            for(let i=0;i<count;i++){
                if(i==0) {
                    rejs.longitude = parseFloat(ArrayString[i]);
                }else if(i==1){
                    rejs.latitude = parseFloat(ArrayString[i]);
                }
            }
        }
    }

    var App = sgm.getSceneApp();
    if (!App) {
        Log.error('getFacilityLongitudeLatitude GlobalData.setAppType');
    }

    if(App.GlobalData.GMType==1) {//0[正常游戏],1[gm工具]
        rejs={ longitude:''+0, latitude:''+0 }; //GM工具代码
    }
    return rejs;
};

// LocationSDK.prototype.getX  LocationSDK.getY
// LocationSDK.prototype.getY
// 优先 使用 高德  若如不到则使用原生
// reTq: 创建房间的时候 不重新获取高德经纬度  进入房间的时候重新获取

/**
 * 获取经纬度
 * @param reTq 是否重新定位
 * @returns {{longitude: string, latitude: string}}
 */
LocationSDK.prototype.getXY = function (reTq) {
    var rejs={
        longitude:'',
        latitude:''
    };
    if (!cc.sys.isNative || !cc.sys.isMobile){
        rejs={
             longitude:'0',
             latitude:'0',
        };
        return rejs;
    }

    var App = sgm.getSceneApp();
    if (!App) {
        Log.error('getXY GlobalData.setAppType');
    }

    if(App.GlobalData.GMType==1) {//0[正常游戏],1[gm工具]
        rejs={ longitude:''+0, latitude:''+0 }; //GM工具代码
    }


    var locationXY = this.getAutaNaviLongitudeLatitude(reTq);//获取高德经纬度
    var locationXY1 = this.getFacilityLongitudeLatitude();//获取系统本身经纬度
    if (locationXY && locationXY.longitude){
        rejs = locationXY;
        Log.debug('获取高德GPS坐标:'+JSON.stringify(rejs));
        return rejs;
    } else if(locationXY1 && locationXY1.longitude) { //如果获取到本地 经纬度 则置为0
        // rejs = {
        //     longitude:'0',
        //     latitude:'0'
        // };
        rejs = locationXY1;
        Log.debug('获取非高德GPS坐标:'+JSON.stringify(rejs));
        return rejs;
    } else {
        return rejs;
    }
};
/**
 * 计算俩点之间距离(底层)
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {number}
 * @constructor
 */
LocationSDK.prototype.GetDistance = function (x1, y1, x2, y2) {
    Log.debug('-----------计算俩点之间距离(底层)-----------');
    if (x1 == 0 || x2 == 0) {
        return 9999;
    }
    if (!cc.sys.isNative || !cc.sys.isMobile) {return 0;}
    var len = 0;
    // Log.debug("前1"+'('+x1+','+y1+')');
    // Log.debug("前2"+'('+x2+','+y2+')');

    x1=parseFloat(x1);
    y1=parseFloat(y1);
    x2=parseFloat(x2);
    y2=parseFloat(y2);

    // Log.debug("后1"+'('+x1+','+y1+')');
    // Log.debug("后1"+'('+x2+','+y2+')');

    if (cc.sys.os == cc.sys.OS_ANDROID ) {
        len = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getGPSDistance", "(FFFF)F", x1, y1, x2, y2);
    } else if (cc.sys.os == cc.sys.OS_IOS) {
        len = jsb.reflection.callStaticMethod("LocationManager", "getGPSDistance:Y1:X2:Y2:", x1, y1, x2, y2);
    }
    var App = sgm.getSceneApp();
    if (!App) {
        Log.error('GetDistance GlobalData.setAppType');
    }
    if(App.GlobalData.GMType==1) {//0[正常游戏],1[gm工具]
        len = 777; //GM工具代码
    }

    Log.debug("-----------两点之间距离(底层)：" + len);
    return len;
};

/**
 * 计算俩点之间距离
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {number}
 */
LocationSDK.prototype.calculateLineDistance = function (x1, y1, x2, y2) {
    Log.debug("-----------根据经纬度坐标计算出距离-->不是地球长度-----------");
    var d1 = 0.01745329251994329;
    var d2 = x1;//start.longitude;
    var d3 = y1;//start.latitude;
    var d4 = x2;//end.longitude;
    var d5 = y2;//end.latitude;
    d2 *= d1;
    d3 *= d1;
    d4 *= d1;
    d5 *= d1;
    var d6 = Math.sin(d2);
    var d7 = Math.sin(d3);
    var d8 = Math.cos(d2);
    var d9 = Math.cos(d3);
    var d10 = Math.sin(d4);
    var d11 = Math.sin(d5);
    var d12 = Math.cos(d4);
    var d13 = Math.cos(d5);
    var arrayOfDouble1 = [];
    var arrayOfDouble2 = [];
    arrayOfDouble1.push(d9 * d8);
    arrayOfDouble1.push(d9 * d6);
    arrayOfDouble1.push(d7);
    arrayOfDouble2.push(d13 * d12);
    arrayOfDouble2.push(d13 * d10);
    arrayOfDouble2.push(d11);
    var d14 = Math.sqrt((arrayOfDouble1[0] - arrayOfDouble2[0]) * (arrayOfDouble1[0] - arrayOfDouble2[0]) +
        (arrayOfDouble1[1] - arrayOfDouble2[1]) * (arrayOfDouble1[1] - arrayOfDouble2[1]) +
        (arrayOfDouble1[2] - arrayOfDouble2[2]) * (arrayOfDouble1[2] - arrayOfDouble2[2]));
    var len = (Math.asin(d14 / 2.0) * 12742001.579854401);

    var App = sgm.getSceneApp();
    if (!App) {
        Log.error('calculateLineDistance GlobalData.setAppType');
    }

    if(App.GlobalData.GMType==1) {//0[正常游戏],1[gm工具]
        len = 777; //GM工具代码
    }
    Log.debug("-----------两点之间距离：" + len);
    return len;
};
module.exports =  new LocationSDK();
