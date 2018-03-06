/************************************************************************
 * Copyright (c) 2017 cardgame
 * Author    : Lee
 * Mail        : crazycode_lee@163.com
 * Date        : 2017-4-28
 * Use      : 房间数据
 ************************************************************************/
var BaseRoomData = require('BaseRoomData');
var RoomData = cc.Class({
    name:'RoomData',
    extends: BaseRoomData,
    properties: {
        currentOperate: -1,//\ 房间中的玩家当前到了什么操作，对应consts中的operateType
        agentStartPos: -1,
        exitData: null,//小结束数据
        gameExitData: null,//游戏大结束
        dzPaiArray: [0, 0, 0],//地主三张牌
        operatePosition: -1,// 当前出牌玩家位置
        operateNoPosition: -1,// 当前不出牌玩家位置
        gameMode: 0,// 0,钻石模式,1,红包模式
        leftTime: 0,// 当前操作结束剩余时间
        beiShu: 1,// 倍数
        isReconnect: 0,// 房间重连状态 0:正常状态,1:正常重连,2:大退重连
        callPoint: -1,// 叫的分数，默认为-1，0 不叫，1 叫1分，2 叫2分，3 叫3分
        jueTouPos: -1,// 撅头 位置 -1为没有撅头
        usedCard: [], // 已经打出的牌
        fullCard: [], // 剩下的全部扑克牌（开始的时候为0-54）
        leftCard: [], // 剩下的牌，也就是记牌器显示的牌
        bwType: 0,// 房间是否开启黑白名单检测 0 不开启 1 黑名单 2 白名单
        diFen: 0, // 当前操作玩家起始叫分
        isAgent: false, //是否是代开房间 代开true,正常房间false
        roomRandomId: 0,//随机房间号，是随机房有房间号,反之没有房间号
        roomTwoAndThreePersonType: 0,// 2/3人斗地主  0默认值,2人,3人
        showCardNum: 0,// 二人斗地主 先叫牌的人 随机的一张明牌
        showCardPos: -1,// 二人斗地主 先叫牌的人 的位置
        lastCardType: 0,// 二人斗地主 底牌类型
        comityCardNum: 0,// 二人斗地主 让牌数量
        multipleNum: 0,// 二人斗地主 特殊底牌翻倍


//---------回放加的参数-------------------
        isPlayBack: false,
        isDzSx: false,//是否以产生地主
        jdzTitlePosition: -1, //叫地主的人
        isFpData: false,//是否已经发牌

    },
    ctor: function () {
    },

    //< 开始游戏
    startGame: function (info) {
        this._super(info);
    },

    /**
     * 设置小结束数据
     * @param data
     */
    setExitData: function (args) {
        this.exitData = args;
    },

    /**
     * 设置大结束数据
     * @param data
     */
    setGameExitData: function (data) {
        this.gameExitData = data;
    },

    clear: function () {
        this.exitData = null;
        this.isReconnect = 0;//0,正常状态，没有重连；1,正常重连；2,大退重连
    },

    /**
     * 重连设置房间数据
     */
    reconnectRoomData: function (room) {
        this.agentStartPos = room.agentStartPos;
        this.currentOperate = room.currentOperate;//\ 房间中的玩家当前到了什么操作
        this.operatePosition = room.operatePosition; // 当前操作玩家的位置
        this.gameMode = room.gameMode;// 创建房间还是红包场
        this.leftTime = room.leftTime;// 倒计时结束时间
        this.dzPaiArray = room.dzPaiArray || [0, 0, 0];// 地主的三张牌
        this.beiShu = room.beiShu || 1;// 倍数
        this.callPoint = (typeof(room.callPoint) != 'undefined') ? (room.callPoint) : (-1);// 叫的分数，默认为-1，0 不叫，1 叫1分，2 叫2分，3 叫3分
        this.jueTouPos = room.jueTouPos;// 撅头 位置 -1为没有撅头
        // 记牌器相关
        this.usedCard = room.usedCard || []; // 已经打出的牌
        this.bwType = room.bwType || 0;// 房间是否开启黑白名单检测 0 不开启 1 黑名单 2 白名单
        this.diFen = room.diFen || 0; // 当前操作玩家起始叫分
        this.isAgent = room.isAgent || false; //是否是代开房间 代开true,正常房间false

        // 2人斗地主相关的字段
        this.showCardNum = room.showCardNum || 0;// 二人斗地主 先叫牌的人 随机的一张明牌
        this.showCardPos = room.showCardPos || -1;// 二人斗地主 先叫牌的人 的位置
        this.lastCardType = room.lastCardType || 0;// 二人斗地主 底牌类型
        this.comityCardNum = room.comityCardNum || 0;// 二人斗地主 让牌数量
    },

    resetRoomData: function (room) {
        var vCurrentOperate = typeof (room.currentOperate);
        if (vCurrentOperate == 'number') {
            this.currentOperate = room.currentOperate;//\ 房间中的玩家当前到了什么操作，对应consts中的operateType
        } else {
            this.currentOperate = -1;//\ 房间中的玩家当前到了什么操作，对应consts中的operateType
        }

        // this.roomAgent = true
        this.agentStartPos = room.agentStartPos || -1;
        this.exitData = null;//结束数据

        this.dzPaiArray = room.dzPaiArray || [0, 0, 0];// 地主的三张牌

        var vOperatePosition = typeof (room.operatePosition);
        if (vOperatePosition == 'number') {
            this.operatePosition = room.operatePosition;// 当前出牌玩家位置
        } else {
            this.operatePosition = -1;// 当前不出牌玩家位置 默认值
        }
        // Log.warn('operatePosition' + '原:' + room.operatePosition + ' 现' + this.operatePosition);

        this.gameMode = room.gameMode || 0;// 0,钻石模式,1,红包模式
        this.leftTime = room.leftTime || 0;// 当前操作结束剩余时间
        this.beiShu = room.beiShu || 1;// 倍数

        this.callPoint = (typeof(room.callPoint) != 'undefined') ? (room.callPoint) : (-1);// 叫的分数，默认为-1，0 不叫，1 叫1分，2 叫2分，3 叫3分
        // this.redPacketLeftTime = room.redPacketLeftTime || 0;// 红包场倒计时领取时间
        this.jueTouPos = -1;// 撅头 位置 -1为没有撅头
        // 记牌器相关
        this.usedCard = []; // 已经打出的牌
        this.fullCard = []; // 剩下的全部扑克牌（开始的时候为0-54）
        this.leftCard = []; // 剩下的牌，也就是记牌器显示的牌
        this.bwType = 0;// 房间是否开启黑白名单检测 0 不开启 1 黑名单 2 白名单
        this.diFen = room.diFen || 1; // 当前操作玩家起始叫分
        this.isAgent = room.isAgent || false; // 是否是代开房间 代开true,正常房间false
        this.roomRandomId = room.roomRandomId || 0;//随机房间号，是随机房有房间号，反之没有房间为0

        if (room.roomId) {
            this.setRoomId(room.roomId);
        }
        // if(room.multipleNum){//二人斗地主 特殊底牌翻倍
        this.multipleNum = room.multipleNum || 0;
        // }
        // 2人斗地主相关的字段
        this.showCardNum = 0;// 二人斗地主 先叫牌的人 随机的一张明牌
        this.showCardPos = -1;// 二人斗地主 先叫牌的人 的位置
        this.lastCardType = 0;// 二人斗地主 底牌类型
        this.comityCardNum = 0;// 二人斗地主 让牌数量

        var vPlayBack = typeof(room.isPlayBack);
        if (vPlayBack == 'boolean') {
            this.isPlayBack = room.isPlayBack;
        } else {
            this.isPlayBack = false;
        }
        var vOperateNoPosition = typeof (room.operateNoPosition);
        if (vOperateNoPosition == 'number') {
            this.operateNoPosition = room.operateNoPosition;// 当前不出牌玩家位置
        } else {
            this.operateNoPosition = -1;// 当前不出牌玩家位置 默认值
        }
        // Log.warn('不出 operatePosition' + '原:' + room.operateNoPosition + ' 现' + this.operateNoPosition);


        if (this.isPlayBack) {
            this.exitData = room.exitData || null;//结束数据
            this.isDzSx = room.isDzSx || false;//是否以产生地主


            var vJdzTitlePosition = typeof (room.jdzTitlePosition);
            if (vJdzTitlePosition == 'number') {
                this.jdzTitlePosition = room.jdzTitlePosition;// //叫地主的人
            } else {
                this.jdzTitlePosition = -1;// //叫地主的人
            }

            this.comityCardNum = room.comityCardNum || 0;// 二人斗地主 让牌数量

            this.fullCard = room.fullCard | [];
            this.leftCard = room.leftCard | [];

            let vFpDataType = typeof(this.isFpData);//是否已经发牌
            if (vFpDataType == 'boolean') {
                this.isFpData = room.isFpData;
            } else {
                this.isFpData = false;
            }

            var vLastCardType= typeof (room.lastCardType);
            if (vLastCardType == 'number') {
                this.lastCardType = room.lastCardType;//二人斗地主 底牌类型
            }

            var vJueTouPos= typeof (room.jueTouPos);
            if (vJueTouPos == 'number') {
                this.jueTouPos = room.jueTouPos;// 撅头 位置 -1为没有撅头
            }
            // Log.warn('地主提醒-有操作的玩家:'+JSON.stringify(this.fullCard) + ' 原'+ JSON.stringify(room.fullCard));
        }
    },

    /**
     * 获取明牌开关信息
     * @returns {{typeNum: number, mp: boolean}}
     */
    getMpOpenInfo: function () {
        var vMpData = {
            typeNum: 0,
            mp: false,
        };
        if (this.playerNum == 2) {// 2人斗地主
            vMpData.typeNum = 2;
            if (this.playTypes[5]) {// 明牌
                vMpData.mp = true;
            }
        } else if (this.playerNum == 3) {//3人斗地主-玩法
            vMpData.typeNum = 3;
            if (this.playTypes[8]) {// 明牌
                vMpData.mp = true;
            }
        }
        return vMpData;
    },

    /**
     * 重置局部数据
     */
    resetLocalData: function () {
        this.lastCardType = 0;// 底牌类型
        this.multipleNum = 0;//二人斗地主 特殊底牌翻倍
    },


});
module.exports = RoomData;