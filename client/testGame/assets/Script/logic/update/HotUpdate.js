
cc.Class({
    extends: cc.Component,

    properties: {
        manifest: cc.RawAsset,// manifest文件
        _storagePath: '',// 文件存储路径
        info: cc.Label,// 显示更新信息的label
        percent: cc.Label,// 更新的百分比的label
        updateUI: cc.Node, //显示热更新进度条
        byteProgress: cc.ProgressBar,// 更新的进度条显示
        loading: cc.Node,// 显示正在获取服务器数据中。。。


        _updating: false,// 当前是否正在更新
        _canRetry: false,// 是否可以重试

        _am: null,// 资源管理器
        _storagePath: null, //储存路径
    },

    onLoad() {
        // this.hotUpdateInit();
        this.checkUpdateVersion();
        // cc.director.loadScene('game');
    },

    //< 检测热更新
    checkUpdateBackFunction: function (ret) {
        if (ret == -1) { //< 检测失败

        } else if (ret == 0) { //< 不需要更新
            // this.loadingLabel.string = "加载资源中...";
            cc.director.loadScene('game');
        } else { //< 有新版本需要更新
            Log.debug('检测热更新:有新版本需要更新：' + ret);
            this.hotUpdate();
        }
    },

    /**
     * 执行更新函数
     */
    hotUpdate: function () {
        Log.debug('--------------更新执行函数----------------------------');
        if (this._am && !this._updating) {
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this._am.loadLocalManifest(this.projectManifestUrl);
            }

            // this._failCount = 0;
            this._am.update();
            this._updating = true;
        }
    },
    // 检查热更新版本
    checkUpdateVersion: function () {
        this.checkfinish_cb = this.checkUpdateBackFunction.bind(this);
        // var url = 'http://192.168.31.80:8080/update/game1/remote-assets/project.manifest';
        // Http.getInstance().getJson(url, {}, (result) => {
        //     debugger;
        //     Log.debug('文件下载结果为  ' + result);
        // });
        // // jsb.Downloader
        var data = { "packageUrl": "http://192.168.31.80:8080/update/game1/remote-assets/", "remoteManifestUrl": "http://192.168.31.80:8080/update/game1/remote-assets/project.manifest", "remoteVersionUrl": "http://192.168.31.80:8080/update/game1/remote-assets/version.manifest", "version": "1.0.1", "assets": { "src/assets/Script/Log.jsc": { "size": 4196, "md5": "0bfec517802514a8859cecf0d68eee81" }, "src/jsb_polyfill.jsc": { "size": 559716, "md5": "df138d95a0d0704c7548dfbd42f396da" }, "src/project.jsc": { "size": 15624, "md5": "f574b6d0eae1eba6ff63892c3446e664" }, "src/settings.jsc": { "size": 2704, "md5": "1933723fb3ed4825d52152264085aa3d" }, "res/import/04/04b32a27a.json": { "size": 1749, "md5": "f1fee11284bc6cd07937bc78fde388be" }, "res/import/09/095fb161.json": { "size": 6814, "md5": "0715643d3c8f28f5a3ce1407ed0cffc3" }, "res/import/0a/0a4d16917.json": { "size": 1447, "md5": "1b17b258f22f79aa76bdaf7a4ef0ea12" }, "res/import/0d/0d9b8df0-7a95-4496-8243-6cb330d9d460.json": { "size": 318, "md5": "221292508aaefd6182894755b928e625" }, "res/import/52/526e8116-f453-4ecf-af7f-7456998ec5e4.json": { "size": 151, "md5": "ad061c31c8f88b599a9b3d582226b2d2" }, "res/import/7e/7e5db0e0-1f04-44bc-9463-0dc1bc58a2c0.json": { "size": 149, "md5": "8491fb918476571cd9e87a349bba05c5" }, "res/import/7e/7e745ea6-4b34-47d2-85d7-116b149dcdf3.json": { "size": 996, "md5": "09b04d2b02ee5788d9e7e3572c5ac685" }, "res/import/7f/7f75ee98-462a-43f7-94a3-487b616f1e09.json": { "size": 156, "md5": "8762b3676953ac0610324eb6098d2a98" }, "res/import/8a/8aab8fcb-2264-49a1-b743-732607cb5d54.json": { "size": 155, "md5": "a8995f8d6f81d4622de4b00d8524214e" }, "res/import/bc/bc219292-c502-45f2-a939-5215b854de34.json": { "size": 157, "md5": "f96bd77027cf7fd5a5b96cce656cf07a" }, "res/import/e6/e6be7179-883e-4453-b4ca-5d22dab1ecd8/raw-skeleton.json": { "size": 12303, "md5": "3ea95d6b0cb14c4e82439aaa34e781bc" }, "res/import/e6/e6be7179-883e-4453-b4ca-5d22dab1ecd8.json": { "size": 13392, "md5": "a235aa7f9b927169e86d84acbe3cecc3" }, "res/import/f1/f13781fd-c8bd-46c7-b6f1-2aea91e55ade/raw-skeleton.json": { "size": 8119, "md5": "0f462a3639b33cc097fe4cbbecc2a4ec" }, "res/import/f1/f13781fd-c8bd-46c7-b6f1-2aea91e55ade.json": { "size": 9150, "md5": "dcda59c4840bb1761a21dc27acc35e3b" }, "res/raw-assets/Texture/HelloWorld.png": { "size": 37864, "md5": "a69a0b857f7462f4dd0d00bb5231a721" }, "res/raw-assets/Texture/singleColor.png": { "size": 17197, "md5": "5825642f69b6fed137482bf89f8f1fd5" }, "res/raw-assets/resources/blackHole.png": { "size": 38968, "md5": "b0e2e90e6676999a8584f840b86eb3a6" }, "res/raw-assets/resources/gear.png": { "size": 94763, "md5": "2ef4f5d023c67bd51f6fc19bcd552b64" }, "res/raw-assets/resources/newEffect/defen/dian.png": { "size": 6774, "md5": "5931c6c92638075d44667b44c3750fc5" }, "res/raw-assets/resources/newEffect/shuipao/paopao.png": { "size": 6092, "md5": "ebf030802976a0b2bc675c41e8eac165" }, "res/raw-assets/resources/project.manifest": { "size": 4102, "md5": "790f4c5e92774ce45909737a2b34cbec" }, "res/raw-assets/resources/update/login_processbar.png": { "size": 2667, "md5": "74aeb114e4295f06be17a423dc8116f9" }, "res/raw-assets/resources/update/login_processbg.png": { "size": 4611, "md5": "d7bb98c66776e52b063b3e162e78aaf2" }, "res/raw-assets/resources/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/haixing/skeleton.atlas": { "size": 760, "md5": "057b9964674db95cc86aa50a6a6e68ac" }, "res/raw-assets/resources/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/haixing/skeleton.png": { "size": 107394, "md5": "836b19c019e40fb16b85056f7d113770" }, "res/raw-assets/resources/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/xuanwo/xuanwo.atlas": { "size": 820, "md5": "9b5d6c33be744979bf32c1f9f85f8d7d" }, "res/raw-assets/resources/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/xuanwo/xuanwo.png": { "size": 158433, "md5": "686f8684d105eea79622d4bdc722b8f8" }, "res/raw-internal/image/default_btn_disabled.png": { "size": 205, "md5": "585114884a0007b544ff1a555197eab7" }, "res/raw-internal/image/default_btn_normal.png": { "size": 223, "md5": "6c31d04886c20b9ec1017a9fec425a68" }, "res/raw-internal/image/default_btn_pressed.png": { "size": 164, "md5": "8b648ba0a453ea34baefaaea74eda6f7" }, "res/raw-internal/particle/atom.plist": { "size": 8110, "md5": "ca868947b5095aa4827fc57f8fd30b0b" } }, "searchPaths": [], "appName": "game1" };
        var vObjectData = JSON.stringify(data);
        this.hotUpdateInit(vObjectData);
        this.loadCustomManifest(vObjectData); //使用自定配置
        this.checkUpdate(); //检测更新
    },

    show: function () {
        this.versionUrl = "";
    },
    /**
     * 删除缓存的临时目录
     * @param dirName 目录名字
     */
    removeTempDir: function (dirName) {
        if (!cc.sys.isNative) {
            Log.debug(' isNative  要删除下载失败后的资源:' + dirName);
            return;
        }
        Log.debug('要删除下载失败后的资源A:' + dirName);
        if (jsb.fileUtils.isDirectoryExist(dirName)) {
            Log.debug('删除下载失败后的资源B:' + dirName);
            jsb.fileUtils.removeDirectory(dirName);
            Log.debug('删除下载失败后的资源C:' + dirName);
        }
    },

    // 热更新初始化
    hotUpdateInit: function (vObjectData) {
        // var data = cc.loader.getRes('project');
        // data = JSON.parse(data);
        var data = JSON.parse(vObjectData);

        /**
         * 在生成资源的脚本中，在写入project.manifest文件的时候，自定义了一个字段，叫做appName，
         * 该字段用来区分不同的游戏，这样的话，不同的游戏就下载到自己单独的目录了。
         */
        var tmp_path = data.appName;
        var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + tmp_path);
        this.removeTempDir(storagePath + '_temp');

        this._storagePath = storagePath;

        // 进行相关内容的打印
        Log.debug('当前版本:' + data.version + '\t解析当前版本:' + tmp_path);
        Log.debug('本地的清单文件:' + this.manifest);
        Log.debug('储存的路径:' + this._storagePath);
        Log.debug("====versionUrl====" + this.versionUrl);

        /**
         * 版本校验回调方法
         * @param {*} versionA 当前版本
         * @param {*} versionB 比较版本
         * 大于0  当前版本 > 比较版本
         * 等于0  当前版本 = 比较版本
         * 小于0  当前版本 < 比较版本
         */
        this.versionCompareHandle = function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };



        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.retain();
        }
        console.log('assetManager 是   ' + JSON.stringify(this._am));


        /**
         * 资源md5验证的方法
         */
        // this._am.setVersionCompareHandle(this.versionCompareHandle);
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                var vvShow = "Verification passed : " + relativePath;
                Log.debug('\t\t\t\t更新文件:' + vvShow);
                return true;
            } else {
                // var vvShow = "Verification passed : " + relativePath;
                // // this.info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                // Log.debug('\t\t\t\t更新文件:' + vvShow);
                // Log.debug("\t修改前文件路径-----开始-----------------");
                // Log.debug('\t\t\t\tpath:' + path);
                // Log.debug('\t\t\t\tasset:' + JSON.stringify(asset));
                // var tmp_ary = path.split('/');
                // var tmp_path = "";
                // for (var i = 0; i < tmp_ary.length - 1; i++) {
                //     tmp_path += tmp_ary[i] + "/";
                // }
                // var tmp_fileName = tmp_ary[tmp_ary.length - 1];
                // var new_fileName = tmp_fileName.split('__')[1];
                // if (tmp_fileName.split('__').length > 0) {
                //     var new_fileName = tmp_fileName.split('__')[1];
                //     let name = tmp_path + new_fileName;
                //     var b = jsb.fileUtils.isFileExist(name);
                //     if (b) {
                //         jsb.fileUtils.removeFile(name);
                //         Log.debug("\t\t\t删除文件:" + name);
                //     }
                //     Log.debug("\t\t修改文件名字 路径:" + tmp_path);
                //     Log.debug("\t\t修改文件名字 修改的名字:" + tmp_fileName);
                //     Log.debug("\t\t修改文件名字 改的名字:" + new_fileName);
                //     jsb.fileUtils.renameFile(tmp_path, tmp_fileName, new_fileName);
                // }
                // Log.debug("\t修改前文件路径-----结束-----------------");
                return true;
            }
        }.bind(this));

        this.info.string = 'Hot update is ready, please check or directly update.';

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(2);
            this.info.string = "Max concurrent tasks count have been limited to 2";
        }
        this.byteProgress.progress = 0;
        Log.debug('版本热更新配置--------------结束------------');


        // this.loadCustomManifest(JSON.stringify(data));
    },

    /**
     * 使用自定配置
     */
    loadCustomManifest: function (vCustomManifestStr) {
        var vType = 0;
        switch (vType) {
            case 0: {
                Log.debug('使用自定配置---------------------开始-------------------');
                //然後, 判斷update資料夾是否存在, 不存在則建立
                if (!jsb.fileUtils.isDirectoryExist(this._storagePath)) {
                    jsb.fileUtils.createDirectory(this._storagePath);
                }
                var path_Manifest_Cache = this._storagePath + '/project.manifest';
                var jsonString = ''; //預留變數
                var netData = JSON.parse(vCustomManifestStr);
                if (!jsb.fileUtils.isFileExist(path_Manifest_Cache)) {
                    Log.debug('\t\t没有更新的文件:' + path_Manifest_Cache + '文件');
                    var vData = cc.loader.getRes('project');
                    if (vData) {
                        let vvJson = JSON.parse(vData);
                        let json = {};
                        json.packageUrl = netData.packageUrl; //远程资源包的根路径
                        json.remoteManifestUrl = netData.remoteManifestUrl; //远程Manifest文件地址
                        json.remoteVersionUrl = netData.remoteVersionUrl; //远程Version文件地址(非必需)
                        json.version = vvJson.version;
                        json.assets = vvJson.assets;
                        jsonString = JSON.stringify(json);
                    }
                } else {
                    Log.debug('\t\t有更新的文件' + path_Manifest_Cache + '文件');
                    jsonString = jsb.fileUtils.getStringFromFile(path_Manifest_Cache);
                    let json = JSON.parse(jsonString);
                    json.packageUrl = netData.packageUrl; //远程资源包的根路径
                    json.remoteManifestUrl = netData.remoteManifestUrl; //远程Manifest文件地址
                    json.remoteVersionUrl = netData.remoteVersionUrl; //远程Version文件地址(非必需)
                    jsonString = JSON.stringify(json);
                }

                Log.debug('\t\t使用自定配置 ' + vType + '  amState:' + this._am.getState() + '\t amState-UNINITED:' + jsb.AssetsManager.State.UNINITED);
                if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                    var vManifest = new jsb.Manifest(jsonString, this._storagePath);
                    this._am.loadLocalManifest(vManifest, this._storagePath);
                    this.info.string = 'Using custom manifest ' + vType;
                }
                Log.debug('使用自定配置---------------------结束-------------------');
            }
                break;
            case 1: {
                Log.debug('\t\t使用自定配置  amState:' + this._am.getState() + '\t amState-UNINITED:' + jsb.AssetsManager.State.UNINITED);
                if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                    var customManifestStr = '';
                    // if(false){//测试代码
                    //     customManifestStr = JSON.stringify(
                    //         {   "packageUrl":"http://test.jinlaihy.com:8000/jcmj/remote-assets/",
                    //             "remoteManifestUrl":"http://test.jinlaihy.com:8000/jcmj/remote-assets/project_1521455351310.manifest",
                    //             "remoteVersionUrl":"http://test.jinlaihy.com:8000/jcmj/remote-assets/version_1521455351310.manifest",
                    //             "version":"1.3.18"
                    //         }
                    //     );
                    // }else{
                    customManifestStr = vCustomManifestStr;
                    // }
                    var vManifest = new jsb.Manifest(customManifestStr, this._storagePath);
                    this._am.loadLocalManifest(vManifest, this._storagePath);
                    this.info.string = 'Using custom manifest ' + vType;
                }
            }
                break;
            case 2: {
                // 因为现在还不方便更新到1.5，所以最终还是采用了类似于你的一个方法：
                // 1. http从远程服务器获取到到现在热更新服务器的信息(packageUrl等)
                // 2. 获取本地的project.Manifest文件，转化成json对象{MANI}
                // 3. 将{MANI}中的packageUrl等信息替换成从远程获取到的信息
                // 4. 将{MANI}写入到一个临时文件temp.manifest中
                // 5. 将temp.manifest的路径作为参数 new 一个 jsb.AssetsManager
                // 6. 剩下的流程就是走原来的热更新了


                //然後, 判斷update資料夾是否存在, 不存在則建立
                if (!jsb.fileUtils.isDirectoryExist(this._storagePath)) {
                    jsb.fileUtils.createDirectory(this._storagePath);
                }

                var path_Manifest_Cache = this._storagePath + '/project.manifest';
                var jsonString = ''; //預留變數
                var netData = JSON.parse(vCustomManifestStr);
                if (!jsb.fileUtils.isFileExist(path_Manifest_Cache)) {
                    Log.debug('没有更新的文件' + path_Manifest_Cache + '文件');
                    //表示cache不存在, 你需要用loadRes從你項目裡的project.manifest讀出來
                    //修改位址，然後寫一份到這個路徑去
                    // var vData = this.projectManifestUrl;//cc.loader.getRes('project');
                    var vData = cc.loader.getRes('project');
                    // Log.debug('本地project数据：'+JSON.stringify(vData)+'\n');
                    if (vData) {
                        // Log.debug('读取出来本地project清单文件:'+vData);
                        // Log.debug('读取出来本地project清单文件----结束');
                        let vvJson = JSON.parse(vData);
                        let json = {};
                        json.packageUrl = netData.packageUrl; //远程资源包的根路径
                        json.remoteManifestUrl = netData.remoteManifestUrl; //远程Manifest文件地址
                        json.remoteVersionUrl = netData.remoteVersionUrl; //远程Version文件地址(非必需)
                        json.version = vvJson.version;
                        // json.assets = netData.assets;
                        jsonString = JSON.stringify(json);
                        jsb.fileUtils.writeStringToFile(jsonString, path_Manifest_Cache); //寫檔
                    }
                } else {
                    Log.debug('有更新的文件' + path_Manifest_Cache + '文件');
                    //表示cache存在, 所以在餵給AssetsManager之前, 我們要先讀出來並修改位址
                    jsonString = jsb.fileUtils.getStringFromFile(path_Manifest_Cache);
                    let json = JSON.parse(jsonString);
                    json.packageUrl = netData.packageUrl; //远程资源包的根路径
                    json.remoteManifestUrl = netData.remoteManifestUrl; //远程Manifest文件地址
                    json.remoteVersionUrl = netData.remoteVersionUrl; //远程Version文件地址(非必需)
                    jsonString = JSON.stringify(json);
                    //然後再寫回去
                    jsb.fileUtils.writeStringToFile(jsonString, path_Manifest_Cache); //寫檔
                }

                // Log.debug('本地project清单文件:'+jsonString);
                Log.debug('本地project清单文件----结束');


                Log.debug('\t\t使用自定配置 amState:' + this._am.getState() + '\t amState-UNINITED:' + jsb.AssetsManager.State.UNINITED);

                if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                    //最後，你再把你項目裡原本的project.manifest餵給 AssetsManager
                    let manifest = new jsb.Manifest(jsonString, this._storagePath); //先建立Manifest的類, 把json餵進去
                    /** 加载一个自定义的本地清单对象
                     * @param localManifest 要设置的本地清单对象
                     * @param storagePath 本地存 储路径
                     * 如果成功加载给定的本地清单和其他清单，它将返回true，否则将返回false
                     */
                    this._am.loadLocalManifest(manifest, this._storagePath);
                }
            }

                break;
        }


    },

    // 点击更新按钮，进行热更新操作
    checkUpdate: function () {
        Log.debug('检测更新-----------开始-----------------');
        if (this._updating) {
            this.info.string = 'Checking or updating ...';
            return;
        }
        Log.debug('\t\t检测更新  amState:' + this._am.getState() + '\t amState-UNINITED:' + jsb.AssetsManager.State.UNINITED);
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            this._am.loadLocalManifest(this.manifest);
        }
        Log.debug('\t\tgetLocalManifest:' + JSON.stringify(this._am.getLocalManifest()) + '\t isLoaded:' + this._am.getLocalManifest().isLoaded());
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            this.info.string = 'Failed to load local manifest ...';
            return;
        }
        this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
        cc.eventManager.addListener(this._checkListener, 1);

        this._am.checkUpdate();
        this._updating = true;

        Log.debug('检测更新-----------结束-----------------');
    },

    // 更新失败，重试
    retry: function () {
        if (!this._updating && this._canRetry) {
            this._canRetry = false;
            this.info.string = 'Retry failed Assets...';
            this._am.downloadFailedAssets();
        }
    },

    // 检查更新
    checkCb: function (event) {
        var ret = 0;
        var vInfo = "";
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST: //错误:没有本地清单文件
                vInfo = "错误:没有本地清单文件 checkCb";
                ret = -1;
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST: //错误:下载清单文件失败
                vInfo = "错误:下载清单文件失败 checkCb";
                ret = -1;
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST: //错误:解析清单文件失败
                vInfo = "错误:解析清单文件失败 checkCb";
                ret = -1;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE: //更新已有数据
                vInfo = "更新已有数据 checkCb";
                ret = 0;
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND: //创建新版本
                vInfo = '创建新版本 checkCb';
                this.byteProgress.progress = 1;
                ret = 1;
                break;
            default:
                return;
        }
        Log.debug('checkCb Code: ' + event.getEventCode() + '\t ' + vInfo);
        this.info.string = vInfo;

        cc.eventManager.removeListener(this._checkListener);
        this._checkListener = null;
        this._updating = false;

        if (this.checkfinish_cb) {
            this.checkfinish_cb(ret);
        }

        if (ret != 0) {
            this.loading.active = false;
            this.updateUI.active = true;
        } else {
            this.updateUI.active = false;
        }
    },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST: //错误:没有本地清单文件
                failed = true;
                this.info.string = '错误:没有本地清单文件 updateCb';
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION: //更新进度
                var vPerent = event.getPercent();
                vPerent = isNaN(vPerent) ? (0) : (vPerent);

                var vvcc = (parseInt(vPerent * 100));
                var vvPerent = (typeof (vvcc) != 'number') ? 0 : vvcc;
                Log.debug('\t\tupdateCb进度:' + vPerent + ' type:' + typeof (vPerent) + '  vvcc:' + vvcc + '  ccType:' + typeof (vvcc) + '  处理后的:' + vvPerent);

                this.byteProgress.progress = vPerent;
                var msg = event.getMessage();
                if (msg) {
                    Log.debug('\t\t\t更新的资源:' + msg + '\n');
                    this.info.string = "正在更新资源...";
                }
                // var vByFile = event.getPercentByFile();
                // Log.debug('perent:' + vPerent);
                // Log.debug('vByFile:' + vByFile);
                var vFiles = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                // var vTotalBytes = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                // Log.debug('vFiles:' + vFiles);
                // Log.debug('vTotalBytes:' + vTotalBytes);
                this.percent.string = '下载文件数量' + vFiles + ' 进度:' + vvPerent + '%';
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST: //错误:下载清单文件失败
                this.info.string = '错误:下载清单文件失败 updateCb';
                failed = true;
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST: //错误:解析清单文件失败
                this.info.string = '错误:解析清单文件失败 updateCb';
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE: //更新已有数据
                this.info.string = '更新已有数据 updateCb';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED: //更新完成
                needRestart = true;
                this.info.string = '更新完成 updateCb ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED: //更新失败
                this._updating = false;
                this._canRetry = true;
                this.info.string = '更新失败 updateCb ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING: //错误:更新失败
                this.info.string = '错误:更新失败 updateCb  ' + event.getAssetId() + ', ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS: //错误:减压失败
                this.info.string = '错误:减压失败 updateCb  ' + event.getMessage();
                break;
            default:
                break;
        }

        Log.debug('\t更新过程中状态:' + this.info.string);

        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            Log.debug('---------游戏重启-----------------开始-----------');
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            var searchPaths = jsb.fileUtils.getSearchPaths();
            // var searchPaths = this._storagePath;//jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            Log.debug("\t\t设置搜索路径新 newPaths:" + JSON.stringify(newPaths) + '\n');
            Array.prototype.unshift(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            Log.debug("\t\t设置搜索路径搜索 searchPaths:" + searchPaths + '\n');
            Log.debug('\t\t设置搜索路径搜索-本地存储路径:' + this._storagePath);
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            // cc.audioEngine.stopAll();

            Log.debug('---------游戏重启-----------------结束-----------');
            cc.game.restart();
        }
    },

    onDestroy: function () {
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
        if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.release();
        }
    },

    start() {

    },

});
