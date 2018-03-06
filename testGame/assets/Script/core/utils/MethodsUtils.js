/**
 *  保存数据到本地
 * @param key
 * @param value
 */
function saveLocalData(key, value) {
    cc.sys.localStorage.setItem(key, value);
}

/**
 * 获取保存数据
 * @param key
 */
function loadSavaLocalData(key) {
    return cc.sys.localStorage.getItem(key);
}

/**
 * 节点显示或隐藏
 * @param vObject
 * @param isActive
 * @returns {boolean}
 */
function nodeShowHide(vObject, isActive) {
    var isOpen = false;
    if (!vObject) {
        Log.error('nodeShowHide:vObject==null');
        return isOpen;
    }

    var vTempObject = null;

    if (vObject instanceof cc.Node) {
        isOpen = true;
        vTempObject = vObject;
    } else if (vObject instanceof cc.Event) {
        if (vObject.detail) {
            if (vObject.detail instanceof cc.Node) {
                isOpen = true;
                vTempObject = vObject.detail;
            }
        }
    } else {
        if (vObject.node) {
            isOpen = true;
            vTempObject = vObject.node;
        }
    }

    if (isOpen) {
        if (vTempObject) {
            vTempObject.active = isActive;
        }
    }

    return isOpen;
}
/**
 * 设置node显示
 * @param vObject
 * @param isActive
 *  @returns {boolean}
 */
function showNode(vObject) {
   return nodeShowHide(vObject, true);
}

/**
 * 设置node隐藏
 * @param vObject
 * @returns {boolean}
 */
function hideNode(vObject) {
    return nodeShowHide(vObject, false);
}
/**
 * 获取对象内部对象
 *
 * 范例:
 *      vObject{
 *          'vNode':{'vTemp':cc.Label},
 *          'vNodeA':cc.Label
 *       }
 *       var vTemp=sgm.MethodsUtils.getNodeChildObject(vObject, 'vNode?vTemp', cc.Label);
 *       var vTempA=sgm.MethodsUtils.getNodeChildObject(vObject, 'vNodeA', cc.Label);
 *
 * @param vObject 指定对象获取内部对象
 * @param objectName 获取的对象名字(父子之间可以用?符号替换,注意是英文的?符号)
 * @param objectType 获取对象的类型
 * @returns {*}
 */
function getNodeChildObject(vObject, objectName, objectType) {
    if (!vObject) {
        return null;
    }
    if (objectName) {
        var vArray = objectName.split('?');
        // Log.debug('获取对象内部对象:' + JSON.stringify(vArray));
        if (vArray && vArray.length >= 2) {
            var iCount = vArray.length;
            for (var i = 0; i < iCount; i++) {
                if (i == (iCount - 1)) {
                    objectName = vArray[i];
                    break;
                }
                var vTemp = vObject.getChildByName(vArray[i]);
                if (vTemp) {
                    vObject = vTemp;
                } else {
                    vObject = null;
                    return null;
                }
            }
        }
    }

    if (objectType === cc.Node) {//cc.Node==cc.Node
        objectType = null;
    }

    var temp = vObject.getChildByName(objectName);
    if (temp) {
        if (objectType) {
            temp = temp.getComponent(objectType);
            if (temp) {
                return temp;
            }
        } else {
            return temp;
        }
    }
    return null;
}

/**
 * 截屏功能
 * @param func 截屏回调函数
 * @returns {string}
 */
function screenShoot(func) {
    if (!cc.sys.isNative) {
        return;
    }
    let dirpath = jsb.fileUtils.getWritablePath() + 'ScreenShoot/';
    if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
        jsb.fileUtils.createDirectory(dirpath);
    }
    let name = 'ScreenShoot' + '.png';
    let filepath = dirpath + name;
    let size = cc.director.getVisibleSize();

    //如果待截图的场景中含有 mask，请开启下面注释的语句
    let rt = cc.RenderTexture.create(size.width, size.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
    // let rt = cc.RenderTexture.create(size.width, size.height);
    cc.director.getScene()._sgNode.addChild(rt);
    rt.setVisible(false);
    rt.begin();
    cc.director.getScene()._sgNode.visit();
    rt.end();
    rt.saveToFile('ScreenShoot/' + name, cc.IMAGE_FORMAT_PNG, true, function () {
        Log.debug('截屏功能 保存 save succ');
        rt.removeFromParent();
        if (func) {
            Log.debug('截屏功能 保存路径:' + filepath);
            func(filepath);
        }
    });
    return filepath;
}

/**
 * 获取头像
 * @param url 图片的地址
 * @param cb 加载图片成功后回调函数
 * @param defaultIcon 没有图片，默认加载的图片
 */
function getIcon(url, cb, defaultIcon) {
    if (!url || url == "") {
        // url = "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0";
        //url="http://kelegames.oss-cn-qingdao.aliyuncs.com/0"
        if (typeof (defaultIcon) == 'undefined') {
            defaultIcon = 'icon';
        }
        cc.loader.loadRes(defaultIcon, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                Log.error("icon获取本地头像出错:" + defaultIcon + err.message || err);
                return;
            }
            cb(spriteFrame);
        });
        return;
    }
    let wechatp = loadSavaLocalData(sgc.StorageConst.LoginStorage.WECHAT_PASSWORD_OBJECT);
    if (wechatp) {//微信记录密码问题
        // url +=(".png");
    } else {
        // url = url.slice(0, url.length - 1);
        // url += "132";
        var num = url.lastIndexOf("/");
        url = url.slice(0, num + 1);
        url +=("132");
    }
    Log.debug('获取头像MethodsUtil 保存记录:' + wechatp + '\turl:' + url);
    cc.loader.load({url: url, type: 'png'}, function (err, tex) {
        if (err) {
            Log.error("MethodsUtils.getIcon:icon获取微信头像出错:" + err.message || err);
            getIcon('', cb);
            return;
        }
        cb(tex);
    });
}


/**
 * 导出函数列表
 */
module.exports = {
    saveLocalData: saveLocalData,//保存数据到本地
    loadSavaLocalData: loadSavaLocalData,//获取保存数据
    showNode: showNode,//设置node显示
    hideNode: hideNode,//设置node隐藏
    getNodeChildObject: getNodeChildObject,//获取对象内部对象
    screenShoot: screenShoot,//截屏功能
    getIcon: getIcon,//截屏功能
};

