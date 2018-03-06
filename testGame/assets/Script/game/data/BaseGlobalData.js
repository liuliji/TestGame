var BaseGlobalData=cc.Class({
    properties: {
        registerType: 2 ,//1游客,2手机微信登录,3只有微信
        measurementType: 0,//0测试服屏蔽[屏蔽代码],1正式服
        GMType: 0,//0[正常游戏],1[gm工具]

        _isVibrate: 1, // 是否开启震动  0否, 1:是
//----Lobby------------
        _server: null,// 服务器数据，"192.168.2.88:30020"
        _isLobbyNet: false,//是否在大厅并且链接的网

        _notice: '',  //公告内容
        _noticeinfo:null,  //公告内容信息
        _activiChess: '',//活动棋牌代理
        _activiMahjong: '',//活动麻将代理

        _redCodeShopList: null, //商品列表--乐豆
        _demondShopList: null, //商品列表--钻石

        _activityShopList: null, // 活动商品列表

        _RedPacketLis: [],  // 红包券 列表

//----Room------------
        _roomServer: null,//roomServer的信息
        _roomHost: null,//roomHost,房间IP
        _dissolveRoomName: null,//解散房间的人

//----Others------------
        redPacketRoom: 0,// 是否开启红包场 0-否 1-是
        ormosiaPay: 0,   //是否开启乐豆支付 0-否 1-是
        //跑马灯信息
        _revolve: null,
        //跑马灯时间
        _revolveTime: 0,

        _cardBgType: 0,//卡牌背景样式
        _winBgType: 0,//桌面背景样式

        _zhuangSetType: 1,// 抢庄状态 1抢庄, 2不抢庄
        _mpType: -1,//是否明牌 -1默认值 1明牌, 2不明牌
        _urlWeiXinIcon: null,//微信头像

        _fdIndex: 0,//封顶系数

        shareState: 0,// 0默认没分享，1分享成功，如果需要，还可以加入其他的分享状态

        _musicVolume: 0,

        _wechatPasswordObjectData: null,//微信密码保存

        _jiaofen: 0,//叫的分数
        _realName: 0,//是否通过实名制验证

        _weitTime: 0, // 飘窗等待时间 默认0.5

        _userSelf: null,//用户房间信息
        _playbackData: null,//回放数据
        _playbackId: null,//回放id
        _playbackUid: null,//回放uid

        _zjItemId: null,// 战绩item Id

        _playbackCode: null,//回放code
        _appType: 0,//0 默认值,1斗地主,2刨幺

        _appList:null,
        _userInfo:null,

    },

    //构造函数
    ctor() { },


    //微信密码保存
    setWechatPasswordObjectData: function (value) {
        this._wechatPasswordObjectData = value;
    },
    //微信密码保存
    getWechatPasswordObjectData: function () {
        return this._wechatPasswordObjectData;
    },

    setMusicVolume: function (value) {
        this._musicVolume = value;
    },
    getMusicVolume: function (value) {
        return this._musicVolume;
    },
    setJiaoFen: function (jiaofen) {
        this._jiaofen = jiaofen;
    },
    getJiaoFen: function () {
        return this._jiaofen;
    },



    testInit: function () {
    },

    // 设置分享状态
    setShareState: function (state) {
        this.shareState = state;
    },
    // 获取分享状态
    getShareState: function () {
        return this.shareState;
    },

    /**
     * 是否开启红包场
     * @param redPacketRoom 是否开启红包场 0-否 1-是
     */
    setRedPacketRoom: function (redPacketRoom) {
        this.redPacketRoom = redPacketRoom;
    },
    /**
     * 是否开启红包场
     * @returns {redPacketRoom|*}
     */
    getRedPacketRoom: function () {
        return this.redPacketRoom;
    },
    /**
     * 是否开启红包支付
     */
    setOrmosiaPay: function (ormosiaPay) {
        this.ormosiaPay = ormosiaPay;
    },
    getOrmosiaPay: function () {
        return this.ormosiaPay;
    },
    /**
     * 设置跑马灯
     */
    setRevolve: function (revolve) {
        this._revolve = revolve;
    },
    /**
     * 获取跑马灯
     */
    getRevolve: function (revolve) {
        return this._revolve;
    },

    /**
     * 封顶系数
     */
    setFDIndex: function (fdIndex) {
        this._fdIndex = fdIndex;
    },
    getFDIndex: function () {
        return this._fdIndex;
    },

    setWeiXinIcon: function (stringIcon) {
        this._urlWeiXinIcon = stringIcon;
    },
    getWeiXinIcon: function () {
        return this._urlWeiXinIcon;
    },

    /**
     * 卡牌背景样式(0 红,1蓝,2青)
     * @param value
     */
    setCardBgType: function (value) {
        this._cardBgType = value;
    },
    /**
     * 卡牌背景样式(0 红,1蓝,2青)
     * @param value
     */
    getCardBgType: function () {
        return this._cardBgType;
    },

    /**
     * 设置桌面背景样式(0绿,1蓝,2青)
     * @param value
     */
    setWinBgType: function (value) {
        this._winBgType = value;
    },
    /**
     * 设置桌面背景样式
     * @param value
     */
    getWinBgType: function () {
        return this._winBgType;
    },

    //抢庄状态 1抢庄, 2不抢庄
    setZhuangSetType: function (type) {
        this._zhuangSetType = type;
    },

    //抢庄状态 1抢庄, 2不抢庄
    getZhuangSetType: function () {
        return this._zhuangSetType;
    },

    //是否明牌 -1默认值 1明牌, 2不明牌
    setMpType: function (type) {
        this._mpType = type;
    },

    //是否明牌 -1默认值 1明牌, 2不明牌
    getMpType: function () {
        return this._mpType;
    },

    // 是否开启震动0：否   1：是
    setVibrate: function (tp) {
        this._isVibrate = tp
    },
    getVibrate: function () {
        return this._isVibrate
    },

    /**
     * 设置本地ip
     * @param ip
     */
    setIp: function (ip) {
        if (ip) {
            sgm.MethodsUtils.saveLocalData(sgc.StorageConst.OtherStorage.LOCAL_IP, ip);
        }
    },
    /**
     * 获取本地ip
     * @returns {*}
     */
    getIp: function () {
        var ip = sgm.MethodsUtils.loadSavaLocalData(sgc.StorageConst.OtherStorage.LOCAL_IP);
        return ip;
    },

//------------------------Labby-----------------------------------

    /**
     * 设置服务器信息"192.168.2.88:30020"
     * 这个是大厅服务器的信息
     */
    setServer: function (http, ws) {
        this._server = {
            'http': http,
            'ws': ws
        };
        Log.debug('\t\t设置大厅服务器信息url:' + JSON.stringify(this._server));
    },
    /**
     * 获取服务器信息
     */
    getServer: function () {
        Log.debug('\t\t获取大厅服务器信息url : ' + JSON.stringify(this._server));
        return this._server;
    },
    /**
     * 设置 大厅是否有链接的网
     * @param isLobbyNet true有网 false没有网
     */
    setLobbyNet: function (isLobbyNet) {
        this._isLobbyNet = isLobbyNet;
    },
    /**
     * 获取 大厅是否有链接的网
     * @returns {boolean} true有网 false没有网
     */
    getLobbyNet: function () {
        return this._isLobbyNet;
    },

    /**
     * 设置公告
     */
    setNotice: function (notice) {
        this._notice = notice;
    },
    /**
     * 获取公告
     */
    getNotice: function () {
        return this._notice;
    },


    /**
     * 设置公告分享详细信息
     * @param args
     */
    setNoticeShareInfo: function (args) {
        this._noticeinfo=null;
        this._noticeinfo={};
        this._noticeinfo = {
            'wxshare': args.wxshare || '',// 房间分享标题
            'notice': args.notice || '', // 公告内容
            'revolve': args.revolve || '',  // 跑马灯
            // 'shareTitle': args.shareTitle || '',// 游戏分享标题
            // 'shareContent': args.shareContent || '', // 游戏分享内容
            'shareFriendsCircle': args.shareFriendsCircle || '',//分享朋友圈
            'shareSession': args.shareSession || '',// 分享给好友
            // 'redPacketRoom': args.redPacketRoom || 0, // 开启红包场
            // 'ormosiaPay': args.ormosiaPay || 0,  // 开启红豆支付
        };
    },
    /**
     * 获取公告详细信息
     * @returns {{wxshare: 房间分享标题, notice: 公告内容, revolve: 跑马灯, shareTitle: 游戏分享标题, shareContent: 游戏分享内容,
     * shareFriendsCircle: 分享朋友圈, redPacketRoom: 开启红包场, ormosiaPay: 开启红豆支付}|*}
     */
    getNoticeShareInfo: function () {
        return this._noticeinfo;
    },

    /**
     * 活动棋牌代理
     * @param chess
     */
    setActiviChess: function (chess) {
        this._activiChess = chess;
    },
    getActiviChess: function () {
        return this._activiChess;
    },
    /**
     * 活动麻将代理
     * @param chess
     */
    setActiviMahjong: function (mahjong) {
        this._activiMahjong = mahjong;
    },
    getActiviMahjong: function () {
        return this._activiMahjong;
    },

    //商城商品列表--红豆
    setRsedCodeShopList: function (slist) {
        this._redCodeShopList = slist
    },
    //商城商品列表--红豆
    getRsedCodeShopList: function () {
        return this._redCodeShopList
    },
    //商城商品列表--钻石
    setDemondShopList: function (slist) {
        this._demondShopList = slist
    },
    //商城商品列表--钻石
    getDemondShopList: function () {
        return this._demondShopList
    },

    // 设置商品列表
    setRedPacketList: function (rpList) {
        this._RedPacketLis = rpList
    },
    getRedPacketList: function () {
        return this._RedPacketLis
    },

    setUserSelf: function (vSelf) {//用户自己信息
        this._userSelf = vSelf;
    },
    getUserSelf: function () {
        return this._userSelf;
    },

    setPlaybackCode: function (vCode) {//回放code
        this._playbackCode = vCode;
    },
    getPlaybackCode: function () {
        return this._playbackCode;
    },

    //回放数据
    setPlaybackData: function (vData) {
        this._playbackData = null;
        this._playbackData = vData;
    },
    getPlaybackData: function () {
        return this._playbackData;
    },

    //回放id
    setPlaybackId: function (vData) {
        this._playbackId = vData;
    },
    getPlaybackId: function () {
        return this._playbackId;
    },

    //回放uid
    setPlaybackUid: function (vData) {
        this._playbackUid = vData;
    },
    getPlaybackUid: function () {
        return this._playbackUid;
    },

    //战绩item Id
    setZjItemId: function (vItemId) {
        this._zjItemId = vItemId;
    },
    getZjItemId: function () {
        return this._zjItemId;
    },


//------------------------Room-----------------------------------
    /**
     * 设置roomServer房间服务器的信息，包括http和websocket的
     */
    setRoomServer: function (server, ws) {
        this._roomServer = {
            'http': server,
            'ws': ws
        }
        Log.debug('\t\t设置房间服务器信息url : ' + JSON.stringify(this._server));
    },
    /**
     * 获取websocket的IP
     */
    getRoomServer: function () {
        Log.debug('\t\t获取房间服务器信息url : ' + JSON.stringify(this._server));
        return this._roomServer;
    },
    /**
     * 设置房间的IP地址
     */
    setRoomHost: function (roomHost) {
        this._roomHost = roomHost;
    },
    getRoomHost: function () {
        return this._roomHost;
    },
    //解散房间的人
    setDissolveRoomName: function (name) {
        this._dissolveRoomName = name;
    },
    //解散房间的人
    getDissolveRoomName: function () {
        return this._dissolveRoomName;
    },

    //实名验证
    setRealNameSystem: function (real) {
        this._realName = real;
    },
    //实名验证
    getRealNameSystem: function () {
        return this._realName;
    },
    //
    getWeitTimes: function () {
        return this._weitTime
    },
    //
    setWeitTimes: function (tm) {
        this._weitTime = tm
    },

    setAppType: function (vAType) {
        this._appType = vAType;
    },

    getAppType: function () {
        return this._appType;
    },

    setAppList:function(list){
        // this._appList = list;
        if (list) {
            if(!this._appList){
                this._appList={};
            }
            var vCount=list.length;
            for(let v=0;v<vCount;v++){
                var str = list[v].appId;//两个不相同的key数据是一样的
                if (str) {
                    this._appList['' + str] =  list[v];
                } else {
                    this._appList =  list[v];
                }
                // str = list[v].appIndex;//两个不相同的key数据是一样的
                // if (str) {
                //     this._appList['' + str] =  list[v];
                // } else {
                //     this._appList =  list[v];
                // }
            }
        }else{
            Log.error('----设置数据出错----');
        }
    },
    getAppList:function(vAppIndex){
        if (vAppIndex) {
            if (this._appList['' + vAppIndex]) {
                return this._appList['' + vAppIndex];
            }
            return null;
        }
        return this._appList;
    },


    setUserInfo:function (args) {
        if(!this._userInfo){
            this._userInfo={};
        }
        this._userInfo=args;
    },

    getUserInfo:function () {
        return this._userInfo;
    }
});

module.exports = BaseGlobalData;