
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
        // cc.director.loadScene('loginGM');
    },

    //< 检测热更新
    checkUpdateBackFunction: function (ret) {
        if (ret == -1) { //< 检测失败

        } else if (ret == 0) { //< 不需要更新
            // this.loadingLabel.string = "加载资源中...";
            cc.director.loadScene('loginGM');
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
        var data = { "packageUrl": "http://192.168.0.105:8080/update/testGame/remote-assets/", "remoteManifestUrl": "http://192.168.0.105:8080/update/testGame/remote-assets/project.manifest", "remoteVersionUrl": "http://192.168.0.105:8080/update/testGame/remote-assets/version.manifest", "version": "1.0.1", "assets": { "src/assets/Script/core/utils/Log.jsc": { "size": 1292, "md5": "f9571b03d6fd77aef394f402994f84e5" }, "src/jsb_polyfill.jsc": { "size": 135168, "md5": "104c408f5c0b4094b74183ce698a2d9d" }, "src/project.jsc": { "size": 73648, "md5": "a656e83ac85c7fee32195825c0f6db3f" }, "src/settings.jsc": { "size": 2928, "md5": "12cd74907ec29e246f4df848abd9742c" }, "res/import/02/0281a8c3-dc60-4bda-928d-d5483bc876f5.json": { "size": 154, "md5": "ddece3aa7272232f57c1fcffbcf848ee" }, "res/import/02/02b2ba24d.json": { "size": 5984, "md5": "6c03ce20c662813218722a0c22d1f2e1" }, "res/import/02/02ec5d0df.json": { "size": 2024, "md5": "e44824b03c134ea12c080e2f9247a7ac" }, "res/import/04/04be4fd8-5e9c-4a96-8e91-c8bc8a636c23.json": { "size": 156, "md5": "c7f0b9761d301ef9a1b501fe7bc3774a" }, "res/import/07/07bbb2495.json": { "size": 2209, "md5": "72a6d2634ec5b9f12483e73704c91f41" }, "res/import/0d/0dfbe8299.json": { "size": 1623, "md5": "b18c43b29c9314331f5a1371dffec047" }, "res/import/0e/0e5da9459.json": { "size": 3210, "md5": "a25a46f76a13f4d46062226414c0204c" }, "res/import/0e/0ec46332b.json": { "size": 2868, "md5": "a17651b119be13aecb45002a994b16f0" }, "res/import/10/10aa38c0-83da-4c2b-a670-867acf594ad3.json": { "size": 174, "md5": "cf43b928ce60a05c1b9eb71f22d4274f" }, "res/import/1b/1b57082e-3b2a-42db-8d36-8b69593ddd6f.json": { "size": 154, "md5": "0c7ea6c7630e9225cad12098e777b2d5" }, "res/import/2f/2f2646e8-d055-415d-bfd0-0dd5e95b6936.json": { "size": 157, "md5": "876c6dd514431c277dec72f3db20d587" }, "res/import/3f/3f23f78a-de1f-431c-b036-21970da686a4.json": { "size": 152, "md5": "999dd2a8ea683529b4dfceaf1ee7b7eb" }, "res/import/5b/5b543ac0-6884-4217-9365-2887beabdfa3.json": { "size": 157, "md5": "8866884271896d07936fad8f13dd3c35" }, "res/import/64/6433b182-b9be-452d-8a2d-3c85017856d9.json": { "size": 163, "md5": "0197dd1631820ad6bc942567e0343ba7" }, "res/import/69/692d56fb-4929-4446-b367-e21b97eb72a5.json": { "size": 153, "md5": "d56220a014c842e171bd78937d6d2d47" }, "res/import/70/704a361a-7f0e-498b-adcd-07e1cfb49c2a.json": { "size": 151, "md5": "f0ac46b45759960842dd17a5f528a4b9" }, "res/import/7b/7b6c933f-4500-49df-821a-803a515dfc05.json": { "size": 153, "md5": "9a93cf17fdde1ffb5fe55b868ab9e34d" }, "res/import/7d/7d2b0973-b4ba-4bef-9d48-feffa6e28a9d.json": { "size": 179, "md5": "d7dc5ef893c4d912a4270a4a75550894" }, "res/import/7e/7ec3f4e5-75f8-479b-9d9a-a2d28f7c6388.json": { "size": 155, "md5": "5e1fd2fbc885f7916cb87c295ed8a1c4" }, "res/import/82/827a5b98-3995-4244-ba56-a66d830383b3.json": { "size": 154, "md5": "463ac86bf7c6adf521c95a77234bdd8e" }, "res/import/83/833df8a2-8f7f-4af5-89d8-95f99058571e.json": { "size": 154, "md5": "b40b304b4fb5987903933c17655c9d4a" }, "res/import/94/94d5711d-1594-40e9-8566-1b45077518c6.json": { "size": 153, "md5": "f33dc36e5075dc1858fe70c662346b87" }, "res/import/9b/9b611a62-46e7-4597-93e0-ee20b90a5de6.json": { "size": 153, "md5": "0b926ddf316b5c54c36d11143fff2ffc" }, "res/import/a0/a0b86347-203c-499c-8b76-107594fd8a2c.json": { "size": 153, "md5": "c49674c07c49a306dd264dbe56f6d16a" }, "res/import/ac/ac7be3ce-e74e-495f-98f8-f410b6ee342a.json": { "size": 157, "md5": "37f6f987bf05412f61c33a3f421f78f8" }, "res/import/c0/c0d0553c-2f90-4015-b26c-7c3b19737879.json": { "size": 157, "md5": "48725e5733dcbd1397bdd34f4995aa44" }, "res/import/d0/d00dcbc8-3cd6-43ef-943e-8abe9ad6fef0.json": { "size": 153, "md5": "d9db9b44f88bd55f463be31abecba0b4" }, "res/import/d9/d9468ac9-8214-4f95-9b14-baebb1ab7d4d.json": { "size": 165, "md5": "2129c2aa9837423540116e24d91798a4" }, "res/import/e0/e0982361-37f6-42e3-b484-79fd309e3d9c.json": { "size": 153, "md5": "b760f552db9263bb766c9e66edde5f79" }, "res/import/e3/e3be2558-52f9-4a70-8b3a-8a0bc35a5a2e.json": { "size": 152, "md5": "59c93ccab8901d690dffefce879069d2" }, "res/import/e5/e5693a8d-d8ac-4441-abcb-681767f8d233.json": { "size": 151, "md5": "97455ffe4d2c466848af64fc0dc9f88d" }, "res/import/ed/ed999867-6252-4624-bd7d-9de2afbd6ea0.json": { "size": 164, "md5": "7538aeb036efbee12a3201f543af71e0" }, "res/import/f9/f9258663-e694-4da4-97be-7a589aeb8769.json": { "size": 155, "md5": "6e931cc42f4fc5f7e1e900810f2dbb0a" }, "res/raw-assets/res/ui_res/Lobby/lobby_bg.png": { "size": 1505774, "md5": "9e548293b1316fcd8abcb511966f0d1a" }, "res/raw-assets/res/ui_res/Login/btn_start.png": { "size": 41461, "md5": "6f940c58a54f99ea0b5460aa51f04bae" }, "res/raw-assets/res/ui_res/common/await/loding_01.png": { "size": 6309, "md5": "10f070504d4585e079385b92d9d47ad9" }, "res/raw-assets/res/ui_res/common/await/loding_02.png": { "size": 6484, "md5": "6c22796b0a546d7a8b3583da3c791b94" }, "res/raw-assets/res/ui_res/common/await/loding_03.png": { "size": 6317, "md5": "85155433dbec288f709b63cd4662c0f5" }, "res/raw-assets/res/ui_res/common/await/loding_04.png": { "size": 6025, "md5": "f3945149208fdb1c1b08b43b1ff5c421" }, "res/raw-assets/res/ui_res/common/await/loding_05.png": { "size": 5606, "md5": "5f2f8443ae3d4f3b61959236bf48ae8f" }, "res/raw-assets/res/ui_res/common/await/loding_06.png": { "size": 5136, "md5": "500c70baa07ef0a87653309706774464" }, "res/raw-assets/res/ui_res/common/await/loding_07.png": { "size": 4354, "md5": "dadbc76a80525be5cda5fe78c6089484" }, "res/raw-assets/res/ui_res/common/await/loding_08.png": { "size": 4705, "md5": "867af36621122ff0ba2a368b76ab2a06" }, "res/raw-assets/res/ui_res/common/await/loding_09.png": { "size": 5069, "md5": "7af690dc75cea08b141dad51a7d672b0" }, "res/raw-assets/res/ui_res/common/await/loding_10.png": { "size": 5427, "md5": "f25316951ca29c97aeb2387c82d35b1c" }, "res/raw-assets/res/ui_res/common/await/loding_11.png": { "size": 5783, "md5": "9d4ec1783d8de5cbd526e06ed8591472" }, "res/raw-assets/res/ui_res/common/await/loding_12.png": { "size": 6374, "md5": "67962dc4179716ffee0cf37e8cfa5f67" }, "res/raw-assets/res/ui_res/common/bg_gray.png": { "size": 930, "md5": "9115fd6da8f85188cdc9bf02c6f31db1" }, "res/raw-assets/res/ui_res/common/bk.png": { "size": 2197, "md5": "319ee350bfbb380953f7f499f1f315a2" }, "res/raw-assets/res/ui_res/common/chatBg.png": { "size": 4964, "md5": "4a6a272c8401a81ff3acd9dfe4c488af" }, "res/raw-assets/res/ui_res/common/common_Cancel.png": { "size": 3734, "md5": "86d69c19eadda4b72147861b18d4c03a" }, "res/raw-assets/res/ui_res/common/common_OK.png": { "size": 3242, "md5": "a25228a2caf2c855054fc5b1f07d5988" }, "res/raw-assets/res/ui_res/common/common_btn.png": { "size": 13455, "md5": "8f2be71b5d1eab625f51c8740a81bd3e" }, "res/raw-assets/res/ui_res/common/common_btn1.png": { "size": 14122, "md5": "cd3ec69778352300600a62b282d7ba9d" }, "res/raw-assets/res/ui_res/common/common_panel.png": { "size": 29415, "md5": "34777903513fa65d0800b4892adbc983" }, "res/raw-assets/res/ui_res/common/error.png": { "size": 11873, "md5": "e6056807631a630ba60a910527aacada" }, "res/raw-assets/resources/Game/bet/bet_bg.png": { "size": 7557, "md5": "ad7ae400f89e1719052ca3fc0fd3fbcf" }, "res/raw-assets/resources/Game/bet/btn_betClear.png": { "size": 11904, "md5": "e9b4abb25ffe619e86ed698628ad881b" }, "res/raw-assets/resources/Game/bet/btn_betMax.png": { "size": 34528, "md5": "ce333b22d8dc922e6ab8777bbd28f90b" }, "res/raw-assets/resources/Game/bet/btn_betOK.png": { "size": 16449, "md5": "06cac455fd0f618a1426925b65c15388" }, "res/raw-assets/resources/Game/bet/chip11.png": { "size": 27979, "md5": "8566fc2ed8cbb1b48e000115c227c8d4" }, "res/raw-assets/resources/Game/bet/chip12.png": { "size": 29962, "md5": "0cd217e435caf901ff93b981f474383c" }, "res/raw-assets/resources/Game/bet/chip15.png": { "size": 26253, "md5": "3874a246dd63d2af169188a29230f071" }, "res/raw-assets/resources/Game/btn_ready.png": { "size": 17297, "md5": "e0b8b4f9cdc473f1fe8c530b1ad611d9" }, "res/raw-assets/resources/Game/btn_start.png": { "size": 17297, "md5": "d1a1ce1984dcf90c9cfa3547856ddf6e" }, "res/raw-assets/resources/Game/buttonBg.png": { "size": 13455, "md5": "8f2be71b5d1eab625f51c8740a81bd3e" }, "res/raw-assets/resources/Game/chatBg.png": { "size": 4964, "md5": "4a6a272c8401a81ff3acd9dfe4c488af" }, "res/raw-assets/resources/Game/gameover_1.png": { "size": 22774, "md5": "0100f12781f01d71e44c469017ed051d" }, "res/raw-assets/resources/Game/gameover_4.png": { "size": 46318, "md5": "df2a553996081110a5f6a1eaf17ee5ba" }, "res/raw-assets/resources/Game/gameover_5.png": { "size": 140526, "md5": "22fe11b5028993f505d5c6a1016a9d1c" }, "res/raw-assets/resources/Game/menu/bg_yc.png": { "size": 1576, "md5": "ab0fff09df2ff75b729b26d9af37a130" }, "res/raw-assets/resources/Game/menu/btn_leave.png": { "size": 16964, "md5": "e1f51acea75fb3c48c62970f80f384f6" }, "res/raw-assets/resources/Game/menu/btn_menu.png": { "size": 10328, "md5": "05004817ac0b07e75489d6f9bfbeeb2e" }, "res/raw-assets/resources/Game/menu/btn_rule.png": { "size": 17348, "md5": "5edfaf8be1b82431e1ccd2f4a1ecd6a1" }, "res/raw-assets/resources/Game/menu/btn_set.png": { "size": 19416, "md5": "13b150cc66baf9c61a96ccd7a6ee7f21" }, "res/raw-assets/resources/Game/menu/btn_upgroup.png": { "size": 19304, "md5": "467d2f99b99e42b0723d955194b71a2d" }, "res/raw-assets/resources/Game/player/bgHead.png": { "size": 10530, "md5": "201b57515104ab854a36760fa8c6c10d" }, "res/raw-assets/resources/Game/player/icon_ready.png": { "size": 9342, "md5": "502e292869ed702599a153a6945be8c1" }, "res/raw-assets/resources/Game/player/roomOwner.png": { "size": 6996, "md5": "3bd4ed4a17b634484e71a9d7ca614495" }, "res/raw-assets/resources/Game/tableBg/bg_zhuomian_lan.png": { "size": 1583315, "md5": "d46ed729e63b8c21042a9254cb74376f" }, "res/raw-assets/resources/Game/tableBg/bg_zhuomian_lv.png": { "size": 1604408, "md5": "bdbaed06e7d17303dfc302f7403c8ee2" }, "res/raw-assets/resources/Game/tableBg/bg_zhuomian_qing.png": { "size": 1560840, "md5": "1de4d061303aa529d2d8e387a0c26cdd" }, "res/raw-assets/resources/icon.png": { "size": 29434, "md5": "f4744f33a4742554b0ed463881805f1c" }, "res/raw-assets/resources/project.manifest": { "size": 11605, "md5": "228002ee78e4409f812abdc70c044a99" } }, "searchPaths": [], "appName": "testGame" };
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
