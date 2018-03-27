/************************************************************************
 * Copyright (c) 2016 App
 * Author    : Shao
 * Mail      : yi-shaoye@163.com
 * Date      : 2016-11-26
 * Use       : 应用总控制
 ************************************************************************/
var HttpScript = require('HttpScript');
// var ProtoManager = require('ProtoManager');
var WebsocketScript = require('WebsocketScript');
var RandomUtils = require('RandomUtils');
var GlobalTable = require('GlobalTable');
var StorageConst = require('StorageConst');
var MsgDispatcher = require('MsgDispatcher');

var WSph = require('WSph');

var App = cc.Class({
    properties: {},
    onLoad: function () {
    },
    initData: function () {
        this.vName = 'DdzApp';
        /**
         * 是否初始化
         */
        this._init = false;
        /**
         * 全局配置数据
         */
        this.GlobalConfig = require('GlobalConfig');

        /**
         * Http请求
         */
        this.Http = new HttpScript();


        /**
         * protobuf管理器
         */
        // this.ProtoManager = new ProtoManager();

        /**
         * 协议管理器
         */
        // this.MsgDispatcher = this.ProtoManager.mMsgDispatcher;
        /**
         * Socket请求
         */
        // this.Socket = new WebsocketScript();
        /**
         * websocket请求
         */
        // this.Websocket = new WebsocketScript();

        this.MsgDispatcher = new MsgDispatcher();

        this.NetworkScript = require('NetworkScript');

        /**
         * 数据表管理器
         */
        this.GlobalTable = GlobalTable.getInstance();

        /**
         * 全局数据管理器
         */
        this.GlobalData = require('GlobalData');
        this.GlobalData.setAppType(1);
        /**
         * 随机数工具类
         */
        this.RandomUtils = RandomUtils.getInstance();

        /**
         * UI管理器
         */
        this.UIManager = null;


        /**
         * 玩家数据管理
         */
        this.UserManager = require('UserManager');

        // 创建socket
        this.Socket = new WSph();
    },

    /**
     * 初始化函数
     */
    Init: function () {
        if (this._init) {
            return false;
        }
        this.initData();
        // this.ProtoManager.setRunAppName(this.GlobalConfig.GameName);

        /**
         * 音效管理器
         */
        var Music = require('Music');
        // if (Music) {
        //     Music.setMusicPath('resources/music/');//设置音乐默认路径//
        //     Music.preload('300.mp3', function () {
        //         // Log.debug('预加载音乐成功:300.MP3');
        //     }.bind(this));
        //     Music.preload('bgm2.mp3', function () {
        //         // Log.debug('预加载音乐成功:bgm2.MP3');
        //     }.bind(this));
        //     Music.preload('bgm3.mp3', function () {
        //         // Log.debug('预加载音乐成功:bgm3.MP3');
        //     }.bind(this));
        // }
        // 初始化随机种子
        this.RandomUtils.initRandomSeed();
        // 初始化Http配置
        // this.Http.initServer(this.GlobalConfig.LocalServer, this.GlobalConfig.IsDebug);
        // 实例化ProtoBuf
        cc.loader.loadResDir('proto', function (err, assets) {
            if (err) {
                Log.error("实例化ProtoBuf:" + err.message || err);
                return;
            }
            // var ProtoCfg = require('ProtoCfg');
            // this.ProtoManager.LoadAllProtoFile(ProtoCfg, this.GlobalConfig.IsDebug);
        }.bind(this));
        // 初始化数据表
        cc.loader.loadResDir('json', function (err, assets) {
            if (err) {
                Log.error("初始化数据表:" + err.message || err);
                return;
            }
            this.GlobalTable.initGameTable();
        }.bind(this));


        // this.Socket.setGameApp(this);
        // this.Websocket.setGameApp(this);
        // this.Http.setGameApp(this);

        this.NetworkScript.registerHandler();// 注册socket回调函数
        this._init = true;
        return true;
    },
    /**
     * 检测App类是否全部初始化完(异步加载)
     */
    checkInit: function (callback) {
        this.GlobalTable.checkInit(function () {
            // this.ProtoManager.checkInit(function () {
                if (callback) {
                    callback();
                }
            // }.bind(this));
        }.bind(this));
    },

    /**
     * 回放执行消息出来
     * @param vSelf 执行者
     * @param protoId 协议数
     * @param vmsg:消息体
     * @returns {{key: string,name:string}}
     */
    playbackBackProto: function (vSelf, protoId, vmsg) {
        // var vProto = this.ProtoManager.playbackProto(protoId, vmsg);//{{key: string, msg: string,name:string}}
        this.MsgDispatcher.playbackMesssage(vSelf, vProto);
        // var vMsg = {key: '', msg: '',name:'',handle:''};
        var proto = {
            key: '' + vProto.key,
            name: '' + vProto.name,
            handle: '' + vProto.handle,
        };
        return proto;
    },
});

module.exports = new App();