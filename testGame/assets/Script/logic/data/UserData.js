/************************************************************************
 * Copyright (c) 2017 cardgame
 * Author    : Lee
 * Mail        : crazycode_lee@163.com
 * Date        : 2017-4-16
 * Use      : 用户数据
 ************************************************************************/
var BaseUserData = require('BaseUserData');
var UserData = cc.Class({
    name:'UserData',
    extends: BaseUserData,
    properties: {
        agent: 0,//代理权限 0没有权限,1有权限
        diZhuStatus: 0,//\玩家是否叫地主
        diZhu: false,//\ 玩家是否是地主
        xiaFen: 0,//\ 下分数字
        cards: [],//\ 玩家手牌
        paiArray: [],// 玩家出去的牌
        winType: 0,//\ 输赢结果
        // win: 0, // 赢的次数
        paiCount: 0,//\ 玩家手中牌数
        chuPaiStatus: 0,// 玩家出牌状态
        place: '未获取到地理位置信息', // 玩家的地理位置信息  -- ww --isOffline: info.isOffline,
        voiceMsg: null,//语音消息记录(指保存一条)
        diamonds: 0,    // 玩家的 钻石数量
        redBean: 0,    // 玩家的 乐豆数量
        redPacketNum: 0,// 红包数
        isTuoGuan: false,// 玩家是否托管
        leftTime: 0,// 红包领取倒计时
        countDown: 300,// 还有多少秒弹出红包
        finished: 0,// 是否完成任务，可领取红包isTi= info.isTi || false,//踢的图标

        callPoint: -1, // 叫的分数，默认为-1，0不叫,1叫1分,2叫2分,3叫3分
        reDouble: 0, // 是否加倍，'NONE':0,默认值； 'JIA_BEI':1,加倍； 'NOT_JIA_BEI': 2,不加倍
        blackList: null, // 玩家的黑名单
        isMPIcon: false,//明牌图标
        doubleNum: 1, // 明牌倍数
    },

    ctor: function () {
    },

    setUserDataInfo: function (info) {
        this.agent = info.agent || 0;//代理权限 0没有权限,1有权限
        this.diZhuStatus = info.diZhuStatus || 0;//\玩家是否叫地主
        this.diZhu = info.diZhu || false;//\ 玩家是否是地主
        // Log.warn('UserData设置地主:'+this.nickName+'\t是否是地主:'+this.diZhu);
        this.xiaFen = info.xiaFen || 0;//\ 下分数字
        this.cards = info.cards || [];//\ 玩家手牌
        this.paiArray = info.paiArray || [];// 玩家出去的牌
        this.winType = info.winType || 0;//\ 输赢结果
        this.win = info.win || 0; // 赢的次数
        this.paiCount = info.paiCount || 0;//\ 玩家手中牌数
        this.chuPaiStatus = info.chuPaiStatus || 0;// 玩家出牌状态

        this.place = info.place || '未获取到地理位置信息'; // 玩家的地理位置信息  -- ww --
        if (!(info.isOffline == null || typeof (info.isOffline) == 'undefined')) {
            this.isOffline = info.isOffline;
        } else {
            this.isOffline = false;
        }

        if (this.zhuang) {
            Log.debug("-----庄------UserData 初始化 设置庄:" + this.nickName);
        }
        this.voiceMsg = null;//语音消息记录(指保存一条)
        this.diamonds = info.diamonds || 0;    // 玩家的 钻石数量
        this.redBean = info.redBean || 0;    // 玩家的 乐豆数量
        this.redPacketNum = parseFloat((info.redPacketNum || 0).toFixed(1));// 红包数
        this.isTuoGuan = info.isTuoGuan || false;// 玩家是否托管
        this.leftTime = info.leftTime || 0;// 红包领取倒计时
        this.countDown = info.countDown || 300;// 还有多少秒弹出红包
        this.finished = info.finished || 0;// 是否完成任务，可领取红包
        this.isTi = info.isTi || false;//踢的图标

        // 叫分玩法相关数据
        this.callPoint = -1; // 叫的分数，默认为-1，0不叫,1叫1分,2叫2分,3叫3分
        this.reDouble = 0; // 是否加倍，'NONE':0,默认值； 'JIA_BEI':1,加倍； 'NOT_JIA_BEI': 2,不加倍
        this.blackList = {};
    },


    //\ 结束时设置玩家数据
    onSettleData: function (info) {
        this.tou = info.tou || [];//\ 头牌
        this.wei = info.wei || [];//\ 尾牌
        this.winType = info.winType || 0;//\ 输赢结果
        this.score = info.score || 0;//\ 玩家最终的积分
        this.winScore = info.winScore || 0;//\ 输赢积分
        this.win = info.win || 0; // 胜利次数
        if (this.zhuang) {
            Log.debug("-----庄------UserData 结束时设置玩家数据 设置庄 " + this.nickName);
        }
    },

    //\ 设置玩家信息
    setPlayerInfo: function (info) {
        this._super(info);
        this.agent = info.agent;//代理权限 0没有权限,1有权限
        this.zhuangStatus = info.zhuangStatus || 0;//\玩家是否抢庄
        this.zhuang = info.zhuang || false;//\ 玩家是否是庄家
        this.xiaFen = info.xiaFen || 0;//\ 下分数字
        this.cards = info.cards || [];//\ 玩家手牌
        this.tou = info.tou || [];//\ 头牌
        this.wei = info.wei || [];//\ 尾牌
        this.winType = info.winType || 0;//\ 输赢结果
        this.score = info.score || 0;
        this.readyStatus = info.readyStatus || false;
        // debugger;
        this.roomOwner = info.roomOwner || false;
        //玩家基础数据
        if (info.image) {
            this.image = info.image;
        }
        this.score = info.score || 0;
        this.ip = info.ip || '';
        this.total = info.total || 0;//< 玩的局数
        this.win = info.win || 0;//< 胜利次数
        this.position = info.position;

        if (!(info.isOffline == null || typeof (info.isOffline) == 'undefined')) {
            this.isOffline = info.isOffline;
        } else {
            this.isOffline = false;
        }
        //GPS 经纬度
        this.longitude = info.longitude || '';     //< 玩家坐标经度
        this.latitude = info.latitude || '';       //< 玩家坐标纬度

        if (info.place && info.place.length > 1) {
            this.place = info.place;  //  玩家的地理位子
        }
        if (info.zhuang) {
            Log.debug("-----庄------UserData 设置玩家信息 设置庄 " + this.nickName);
        }

        this.cards = info.cardArray || info.cards || [];//玩家手牌
        this.paiCount = info.paiCount || 0;//\ 玩家手中牌数
        this.paiArray = info.paiArray || [];// 玩家出去的牌
        this.diZhu = info.diZhu || false;// 是否是地主
        // Log.warn('setPlayerInfo设置地主:'+this.nickName+'\t是否是地主:'+this.diZhu);
        this.diZhuStatus = info.diZhuStatus || 0;//是否叫地主(1叫地主,2不叫地主)
        // Log.warn('是否叫地主setPlayerInfo:'+this.nickName+'\t是否叫地主现:'+this.diZhuStatus + ' 原'+ info.diZhuStatus);
        this.isTuoGuan = info.isTuoGuan || false; //
        // this.redBean = info.redBean || 0;// 乐豆数
        this.leftTime = info.leftTime || 0;// 红包倒计时
        this.countDown = info.countDown || 300;// 还有多少秒弹出红包

        this.callPoint = info.callPoint || -1; // 叫的分数，默认为-1，0 不叫，1 叫1分，2 叫2分，3 叫3分

        this.diamonds = info.diamonds || 0;    // 玩家的 钻石数量
        this.redBean = info.redBean || 0;    // 玩家的 乐豆数量
        this.redPacketNum = parseFloat((info.redPacketNum || 0).toFixed(1));// 红包数
        this.finished = info.finished || 0;// 是否完成任务，可领取红包

        this.isTi = info.isTi || false;//踢的图标

        var vMpIconType = typeof (info.isMPIcon);
        if (vMpIconType == 'boolean') {
            this.isMPIcon = info.isMPIcon;//明牌
        } else {
            this.isMPIcon = false;//明牌
        }
        // Log.warn('设置玩家信息 名字:'+this.nickName+' 是否明牌:'+this.isMPIcon);
        var vDoubleNumType = typeof (info.doubleNum);
        if (vDoubleNumType !== 'undefined') { // 明牌倍数
            this.doubleNum = info.doubleNum;
        }
    },

    /**
     * 重置玩家数据
     */
    reset: function () {
        // Log.warn(this.nickName+'---重置玩家数据---');
        this.zhuangStatus = 0;//\玩家是否抢庄
        this.zhuang = false;//\ 玩家是否是庄家
        this.xiaFen = 0;//\ 下分数字
        this.cards = [];//\ 玩家手牌
        this.tou = [];//\ 头牌(小)
        this.wei = [];//\ 尾牌(大)
        this.winType = 0;//\ 输赢结果
        this.wintypeTou = 0;//\ 头牌输赢状态
        this.wintypeWei = 0;//\ 尾牌输赢状态

        this.voiceMsg = null;//语音消息记录(指保存一条)
        this.paiCount = 0;//\ 玩家手中牌数
        this.chuPaiStatus = 0;// 玩家出牌状态
        this.paiArray = [];
        this.diZhuStatus = 0;//\玩家是否叫地主
        this.diZhu = false;//\ 玩家是否是地主
        // Log.warn('reset设置地主:'+this.nickName+'\t是否是地主:'+this.diZhu);
        this.leftTime = 0;
        // this.countDown = 300;// 还有多少秒弹出红包//
        //————【这里不重置倒计时，是为了防止重置继续的时候，倒计时跳到了5秒，然后，有网的时候，有变成很少的秒数】
        //————【因为只有红包场用到这个字段，所以不影响的】

        // Log.debug("------UserData reset 应该是清理玩家数据 庄：" + this.zhuang+' 地主:'+ this.diZhu);
        // 叫分玩法相关数据
        this.callPoint = -1; // 叫的分数，默认为-1，0 不叫，1 叫1分，2 叫2分，3 叫3分
        this.reDouble = 0; // 是否加倍，'NONE':0,默认值； 'JIA_BEI':1,加倍； 'NOT_JIA_BEI': 2,不加倍
        this.reconnect = false;
    },
    /**
     * 同步玩家数据(随机房转正常房)
     * @param args
     */
    syncPlayerData: function (args) {
        if (typeof(args.uid) !== 'undefined') {
            this.uid = args.uid;// 玩家id
        }
        if (typeof(args.nickName) !== 'undefined') {
            this.nickName = args.nickName;// 玩家昵称
        }
        if (typeof(this.sex) !== 'undefined') {
            this.sex = args.sex;// 性别
        }
        if (typeof(args.image) !== 'undefined') {
            this.image = args.image;// 头像
        }
        if (typeof(args.ip ) !== 'undefined') {
            this.ip = args.ip || ''; // 玩家ip
        }

        if (typeof(args.longitude) !== 'undefined') {
            this.longitude = args.longitude; //< 玩家坐标经度
        }
        if (typeof(args.latitude) !== 'undefined') {
            this.latitude = args.latitude;   //< 玩家坐标纬度
        }
        if (typeof(args.place) !== 'undefined') {
            this.place = args.place; // 玩家的地理位置信息
        }

        if (typeof(args.total) !== 'undefined') {
            this.total = args.total;//< 玩的局数
        }
        if (typeof(this.win) !== 'undefined') {
            this.win = args.win;//< 胜利次数
        }
    },
    /**
     * 设置明牌数据
     * @param args
     */
    setMPData: function (args) {
        this.cards = args.cardArray || [];//玩家手牌
        this.isMPIcon = true;//明牌图标
        // Log.warn('设置明牌数据 名字:'+this.nickName+' 是否明牌:'+this.isMPIcon);
    },
    weiTouCard: function () {
        var cardArray = [];
        for (let i = 0; i < this.tou.length; i++) {
            cardArray.push(this.tou[i]);
        }
        for (let i = 0; i < this.wei.length; i++) {
            cardArray.push(this.wei[i]);
        }
        return cardArray;
    },

    setVoiceMsg: function (voiceMsg) {
        this.voiceMsg = voiceMsg;//语音消息记录(指保存一条)
        Log.debug("设置的数据是:" + JSON.stringify(this.voiceMsg));
    },

    getVoiceMsg: function () {
        return this.voiceMsg;
    },

    getDiamonds: function () {
        return this.diamonds
    },
    getRedBean: function () {
        return this.redBean
    },
    /**
     * -- ww --
     * 玩家地理位子信息
     * */
    setUserStringPlace: function (place) {
        this.place = place;
    },
    setRedPacketNum: function (num) {
        this.redPacketNum = parseFloat((num || 0).toFixed(1));// 红包数
    },

    /**
     * 设置黑名单数据
     * @param list
     */
    setBlackList: function (list) {
        if (list) {
            var str = list.uid || list.bwUid;
            if (str) {
                this.blackList['' + str] = list;
                // if (!this.blackList.hasOwnProperty('' + str)) {
                //     this.blackList[''+str]=list;
                // } else {
                //     this.blackList[''+str]=list;
                // }
            } else {
                this.blackList = list;
            }
        }
    },
    /**
     * 删除一条记录
     * @param item
     */
    deleteBlackListItem: function (item) {
        if (this.blackList['' + item]) {
            this.blackList['' + item] = null;
            delete this.blackList['' + item];
        }
    },

    /**
     * 获取黑名单数据
     * @param item 获取单挑数据或全部数据
     * @returns {{}|*}
     */
    getBlackList: function (item = null) {
        if (item) {
            if (this.blackList['' + item]) {
                return this.blackList['' + item];
            }
            return null;
        }
        return this.blackList;
    },

});

module.exports = UserData;