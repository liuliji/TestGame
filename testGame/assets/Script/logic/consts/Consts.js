/************************************************************************
 * Copyright (c) 2016 App
 * Author    : Lee
 * Mail      : crazycode_lee@163.com
 * Date      : 2017-4-19
 * Use       : 全局常量
 ************************************************************************/

// 窗口索引
var enViewType = {
    //< 登录场景
    LoginUI: 10001,      //< 登录界面
    HotUpdateUI: 10002,  //< 热更新界面
    RegisterUI: 10003,   //< 注册界面
    LoginGMUI: 10004,    //< GM登录

    //< 游戏场景
    GameUI: 20000, //  游戏主逻辑层
    CarExitUI: 20002,// 游戏结束UI界面
    SettleUI: 20004,// 游戏结束UI界面

    PidgeyViewUI: 20005,//设置簸簸数
    PlayerActionUI: 20006,//动作(休，跟，大。。。)
    SettlementCardUI: 20007,//分派
    RomLandlordUI: 20008,//\ 抢地主
    BetJettonUI: 20009,//下注
    HelpUI: 20010,//\ 帮助视图

    DarknessCardUI:20012,//摸牌
    PlayMethodUI: 20013,//\ 玩法，帮助
    shareUI: 20014,//\ 好友、朋友圈分享


    GoOutTitleUI: 20015,//\ 出牌提示(不出 提示 出牌)
    GameExitViewUI:20016,//游戏大结束
    RedPacketTimeUI: 20017,// 红包时刻页面
    EnvelopeDeclareUI: 20018,//红包说明
    GameMenuUI: 20019,//游戏中菜单
    ChatButtonUI: 20020,//聊天菜单
    JiPaiQiUI: 20021,//记牌器
    PLayBackViewUI: 20022,//回放


    //< Lobby大厅场景
    LobbyUI: 30000, //大厅页面主逻辑层
    CreateViewUI: 30001,//大厅页面创建房间layer
    EnterUI: 30002, //大厅页面进入房间layer
    DissolutionUI: 30003, //< 解散房间倒计时界面
    SetViewUI: 30004,//系统设置(音乐设置)
    ChatViewUI: 30005,//聊天短语
    ShowInfoUI: 30006,//显示ip
    ActivityUI: 30007,//活动
    StandingsUI: 30008,//战绩
    ServiceUI: 30009,//客服
    GamesArePlayedUI: 30010,//玩法
    UserInfoUI: 30011,//显示用户信息
    AgencyRoomUI: 30012,//代开房间
    AgencyRoomHint: 30013,//代开房间提示
    PlayerRoomAgencyInfo:30014,//代开玩家信息
    PlayerGuideUI: 30015,//新手引导
    StoreViewUI:30016,//游戏商城
    RedPacketUI:30017,//红包
    packetHistoryUI:30018,//红包兑换记录
    FeedbackViewUI:30019,//反馈
    LobbyGameMenuUI:30020,//大厅菜单
    

    BlackAndWhiteHintViewUI:30021,//黑名单-提醒
    BlistHelpUI:30022,//黑名单-帮助
    WbPlayerInfoUI:30023,//黑名单-Item中的人物属性
    WbListViewUI:30024,//黑名单-帮助
    AgencyBlistHintUI:30025,//黑名单-代开提醒
    RealNameSystemUI:30026,//实名制
    UpdateIntroductionView:30027,//更新日志
    MapAndRankingListUI:30028,//地图
    ReplayListItemViewUI:30029,//回放列表
    FindReplayView:30030,
    GameNoticeViewUI:30031,//游戏声明



    ConsoleUI: 20100, // 日志UI界面


    RedPhoneViewUI: 40001,  // 红包注册手机号
    NeedMoneyViewUI: 40002,  // 红包券 不足够
    TQRedPocketViewUI: 40003,  // 红包注册手机号
    ChoosePassagewayUI: 40004, // 选择 支付方式

    PyWbPlayerInfoUI: 50001, //
};



// 账号类型
var enLoginType = {
    'LT_GUEST': 0,      // 游客
    'LT_WX': 1,         // 微信
    'LT_REGISTER': 2,   // 注册
    'LT_LOGIN': 3,      // 登录
    'LT_GM': 4,         // GM
};

// 投票结果
var enAfreeType = {
    'DEFAULT': 0,  //< 未选择
    'AGREE': 1,    //< 同意
    'DISAGREE': 2  //< 不同意
};

// 房间状态
var enRoomState = {
    'FIRST_BEGIN': 0,   //< 第一次开始
    'READY': 1,         //< 准备
    'GAMING': 2,        //< 游戏中
    'GAME_OVER': 3,     //< 结束
    'UNGROUPING': 4     //< 投票
};

var OPREATE_TYPE = { //当前操作
    'READY': 0, //准备
    'JIAO_DI_ZHU': 1, //叫地主
    'CHU_PAI': 2, //出牌
    'JIAO_FEN': 3, //叫分
    'QIANG_DI_ZHU': 4, //抢地主
    'TI_NO_YES': 5, //踢|不踢
    'GEN_NO_YES': 6, //跟|不跟
    'FAN_TI_NO_YES': 7, //反踢|不反踢
    'PEOPLE_TWO_QIANG_DI_ZHU': 8, //二人斗地主 抢地主
    'PEOPLE_TWO_JIAO_DI_ZHU': 9 //二人斗地主 叫地主
};

var DIZHU_TYPE = { //是否叫地主
    'NONE': 0, //未操作
    'JIAO_YES': 1, //叫地主
    'JIAO_NO': 2, //不叫
    'QIANG_YES': 3, //抢
    'QIANG_NO': 4, //不抢
    'TI_YES': 5, //踢
    'TI_NO': 6, //不踢
    'GEN_YES': 7, //跟
    'GEN_NO': 8, //不跟
    'FAN_TI_YES': 9, //反踢
    'FAN_TI_NO': 10, //不反踢
    'PEOPLE_TWO_QIANG_YES': 11, //二人斗地主 抢
    'PEOPLE_TWO_QIANG_NO': 12, //二人斗地主 不抢
    'PEOPLE_TWO_JIAO_YES': 13, //二人斗地主 叫地主
    'PEOPLE_TWO_JIAO_NO': 14, //二人斗地主 不叫



    'PLAYBACK_JF': 20 //叫分(回放用)
};



var CHUPAI_STATUS = {  //玩家出牌状态
    'NONE': 0,  //未操作
    'YES' : 1,  //出牌
    'NO'  : 2  //不出牌
}

var winType = { //输赢结果
    'NONE': 0,  //无状态
    'WIN': 1,  //赢
    'LOSE': 2,  //输
    'EQUAL': 3,  //平局。和
}

var GAME_MODE = {
    'ROOM_CARD': 0, //钻石模式
    'RED_PACKET': 1, //红包
}

var REDOUBKE_TYPE = {// 玩家是否加倍
    'NONE': 0,  // 默认值
    'REDOUBLE': 1, // 加倍
    'NOT_REDOUBLE': 2, // 不加倍
}

var ROOM_RECONNECT = {// 房间重连状态
    'NONE': 0, // 正常状态，没有重连
    'NORMAL_RECONNECT': 1,// 正常重连
    'EXIT_RECONNECT': 2,// 大退重连
}

var DISSOLVE_TYPE = { //解散房间类型
    'OVER': 0, //正常结束结束
    'GM': 1, //客服解散
    'REQUEST': 2, // 玩家申请解散
    'REQUEST_FZ': 3, // 房主解散 房间内
    'FZ': 4 // 房主解散 大厅内
};

//游戏状态类型
var GameStateType={
    PREPARED_START:1,//准备开始
    DEAL_CARD:20,//处理卡牌(发牌)
    ROB_LANDLORD:21,//抢地主
    ROB_LANDLORD_SCORE:22,//叫分
    // GO_OUT_TITLE:22,//出牌提示(不出 提示 出牌)
};

//\重连状态机
var ReconnectStateType = {
    FIRST_BEGIN: 0,         //\第一次开始
    READY: 1,               //\准备状态开始
    BEFORE_JIAO_DI_ZHU: 2,  //\叫地主前
    AFTER_JIAO_DI_ZHU: 3,   //\叫地主后
    BEFORE_CHU_PAI: 4,      //\出牌前
    AFTER_CHU_PAI: 5,       //\出牌后
    BEFORE_JIAO_FEN: 6,     // 叫分前
    AFTER_JIAO_FEN: 7,      // 叫分后

    BEFORE_QDZ: 8,      //抢地主
    BEFORE_TI_GEN_FAN_TI:9,//踢跟反踢
    // BEFORE_TI_YES_NO:9,//提不提
    // BEFORE_GENG_YES_NO:10,//跟不跟
    // BEFORE_FANTI_YES_NO:11,//反踢不反踢

    SETTLE: 12,             //\结束
};

var ActionType={
    NO_ACTION:0,
    LOSE_ACTION:1,//丢
    REST_ACTION:2,//休
    HEEL_ACTION:3,//跟
    MAX_ACTION:4,//大
    KNOCK_ACTION:5,//敲
};



//协议事件
var  AgreementEvent={
    AGR_START_LICENSING:"emitStartLicensing",//发牌
    AGS_CURRENT_OPERATE:"emitCurrentOperate",//玩家当前操作(准备|叫地主|出牌)

    AGS_ZB:"emitStateZB",//玩家当前操作---准备
    AGS_JDZ:"emitStateJDZ",//玩家当前操作---叫地主
    AGS_CP:"emitStateCP",//玩家当前操作---出牌
    AGS_JF:'emitStateJF',// 玩家当前操作---叫分

    // AGS_QDZ:'emitStateQDZ',// 玩家当前操作---抢地主
    // AGS_TI_YES_NO:'emitStateTiYesNo',// 玩家当前操作---踢|不踢
    // AGS_GEN_YES_NO:'emitStateGenYesNo',// 玩家当前操作---跟|不跟
    // AGS_FAN_TI_YES_NO:'emitStateFanTiYesNo',// 玩家当前操作---反踢|不反踢
    AGS_QTGF:'emitQTGF',//抢地主，踢|不踢，跟|不跟，反踢|不反踢


    AGS_JDZ_TITLE:'emitJDZTitle',//提醒-叫地主

    AGS_GIVE_UP:"emitGiveUp",//不出牌
    AGS_CHU_PAI:'emitChuPai',//出牌

    AGR_DISSOLUTION_MIN:'emitDissolutionMin',//小结束
    AGR_DISSOLUTION_MAX:'emitDissolutionMax',//大结束
    AGR_DISSOLUTION_HIDE:'emitDissolutionHide',//隐藏菜单


    AGR_AGENCY_START:"agencyStart",//\ 代开房间，开始游戏
    AGR_LAST_CARD:"emitLastCard",// 给地主发最后三张牌，并展示出来
    AGR_SHOW_RED_PACKET:'redPacketTime',// 显示红包视图
    AGR_GET_RED_PACKET:'getRedPacket',// 领取红包
    AGR_TUO_GUAN: 'emitTuoGuan',// 托管

    // 叫分玩法相关事件
    AGR_JIAO_FEN: 'emitJiaoFen',// 叫分

    AGS_UPDATE_JPQ: 'emitUpdateJPQ',// 刷新记牌器

    AGR_TITLE_TI_FANTI_GEN:'emitTitleTiFanTiGen',//提醒--踢反踢跟
    AGR_TITLE_QDZ:'emitTitleQiangDiZhu',//提醒--抢地主

    AGR_SYNC_PLAYER_DATA:'emitSyncPlayerData',//同步玩家数据



    AGR_MP_BEI_SHU:'emitMinPaiBeiShu',//明牌倍数
    AGR_MP_DATA:'emitMinPaiData',//明牌数据


    AGP_UPDATA_CARD_BG_TYPE:'updataCardBgType',//更新卡牌背景样式
    AGP_UPDATA_CUT_ICON:'cutIcon',//切换-地主头像或微信头像

    AGR_REPLAY_DATA:'replayData',//切换回放


    // 刨幺新添加的事件
    AGR_UPDATE_SCORE: 'updateScore',// 更新每组的分数
    AGR_ENTER_SNOW: 'enterSnow',// 雪牌
    AGR_FRIEND_CARD:'emitFriendCard',// 出完后对家手牌
    AGR_KANGQI_POSITION:'emitKangqiPosition',// 扛旗玩家位置
    AGR_SELECT_SNOW: 'emitSelectSnow',// 选择雪牌
    AGR_EXCHANGE_POSITION: 'emitExchangePosition',// 交换后通知所有玩家
    AGR_BEGIN_EXCHANGE: 'emitBeginExchange',// 通知所有人开始交换
    AGR_REFUSE_EXCHANGE: 'emitRefuseExchange',// 拒绝交换
    AGR_ZHUANYAO_GROUP: 'emitZhuanYaoGroup',// 转幺分组

}

var PlayerBgScale={
    selfbgWidthScale:0.4,
    otherbgWidthScale:0.48,

    selfDownScale: 0.85,// 自己的下面的牌

    upSelfCardScale:0.6,//自己上面的牌大小 0.6
    upOtherCardScale:0.5,//别人上面的牌大小

    downMAXscale:0.4,
    downMINscale:0.5,

    upMaxScale:0.6,

    downTwoOtherScale:0.4,//别人下边的牌(2人斗地主)

    downThreeMpScale:0.46,//别人下边明牌的牌(3人斗地主)

    upThreeMaxScale:0.7,//(3人斗地主) 出去的牌第一帧大小(缩放)
    upThreeSelfScale:0.6,//自己的 出去的牌最终显示的大小(缩放)
    upThreeScale:0.6,//别人的


    upTowMaxScale:0.8,//(2人斗地主) 出去的牌第一帧大小
    upTwoSelfScale:0.7,//自己的(2人斗地主)
    upTwoScale:0.7,//别人的(2人斗地主)

    exitDownScale:0.63,//结束剩下的牌-缩放大小
    exitDownJiJuScale:0.4,//结束剩下的牌-间距


    TimeMax:20,//时间最大值
    ClockAnimateTime: 6,// 闹钟时间开始倒计时的最大时间

    self2DownScale: 0.75,// 自己的下面的牌

}

var PyBgScale = {// 刨幺相关的缩放比例
    upMaxScale: 0.4,// 出去的牌的缩放
    upSelfCardScale: 0.6,// 自己上面出去的牌的大小

    upThreeSelfScale:0.6,//自己的 出去的牌最终显示的大小(缩放)
    upThreeScale:0.4,//别人的
    selfbgWidthScale:0.3,

    upTowMaxScale:0.7,//(2人刨幺) 出去的牌第一帧大小
    upTwoSelfScale:0.6,//自己的(2人刨幺)
    upTwoScale:0.4,//别人的(2人刨幺)
    exitDownJiJuScale:0.4,//结算剩下的牌-间距
    exitDownScale:0.5,//结算剩下的牌-缩放大小
    upThreeMaxScale:0.7,//(3人斗地主) 出去的牌第一帧大小(缩放)

}
/**
 * 卡牌背景
 * @type {[*]}
 */
var CarBackType = [
    'b-poker_back1',//红
    'b-poker_back0',//蓝
    'b-poker_back2',//青
];

//封顶-最小数
var FD_MIN=[
    [1,5,5],
    [5,10,20],
    [20,50,100],
    [1,5,10],
    [1,5,10],
    [1,5,10],
];
/**
 * 创建房间信息
 * @type {{}}
 */
var createRoomInfo={
    inning:[0,12,16,24],//局数
    FDType:[48,96,192,'不封顶','分封顶'],//分数 封顶

    roomType:['叫分','经典'],

    jpContentType:['带踢','撅头','2王或4个2必叫地主'],//叫分内容---最新
    jdType:['随机','先出完先叫'],//经典内容
    tsType:['记牌器','防作弊','禁言','明牌'],//特殊内容(三人)


    w2tiType:['','2王或4个2必叫地主','带提'],
    jfType:['撅头','2王或4个2必叫地主'],//叫分内容

    randomRoomNumber:[3,5],//随机房间数量


    RPType:[4,5],//让牌
    TSTYpe:['底牌翻倍','比调','记牌器','明牌'],//特殊(二人)

};

var PyCreateRoomInfo = {
    inning:[0,5,9,19],//局数
    yaoType:['亮幺','不亮幺'],// 是否亮幺
    threeType:['3是会儿'],// 3的大小
    tsType:['记牌器','防作弊','禁言'],//特殊内容
    dingYaoType: ['定幺','转幺'],//
}

var CARD_TYPE = { //牌类型
    'NOME': 0, // 无牌型
    'SAN_TIAO': 1, // 三条
    'TONG_HUA_SHUN': 2, // 同花顺
    'SHUN_ZI': 3, // 顺子
    'TONG_HUA': 4, // 同花
    'DUI_ZI': 5, // 对子
    'KING_TWO': 6, // 双王
    'KIING_ONE': 7 // 单王
};



var PY_OPREATE_TYPE = { //刨幺当前操作
    'READY': 0, //准备
    'JIAO_DI_ZHU': 1, //叫地主
    'CHU_PAI': 2, //出牌
    'JIAO_FEN': 3, //叫分
    'QIANG_DI_ZHU': 4, //抢地主
    'TI_NO_YES': 5, //踢|不踢
    'GEN_NO_YES': 6, //跟|不跟
    'FAN_TI_NO_YES': 7, //反踢|不反踢
    'PEOPLE_TWO_QIANG_DI_ZHU': 8, //二人斗地主 抢地主
    'PEOPLE_TWO_JIAO_DI_ZHU': 9 //二人斗地主 叫地主
};


var SHORT_CHAT_TYPE = {// 短语类型 [0 合理不，1 不合理，2 让我来，3 你管，4 单，5 对，6 龙，7 放他，8 沉底]
    HLB: 0,// 合理不
    BHL: 1,// 不合理
    RWL: 2,// 让我来
    NG: 3,// 你管
    DAN: 4,// 单
    DUI: 5,// 对
    LONG: 6,// 龙
    FT: 7,// 放他
    CD: 8,// 沉底
    DIS_SNOW:9,// 不雪牌
    SNOW:10,// 雪牌
}

/**
 * 导出对象
 */
module.exports = {
    'enViewType': enViewType,   //< 窗口索引
    'enLoginType': enLoginType, //< 账号类型
    'enAfreeType': enAfreeType, //< 投票结果
    'enRoomState': enRoomState, //< 房间状态
    'GameStateType': GameStateType, //< 游戏状态类型
    'ReconnectStateType': ReconnectStateType,//\ 重连状态机
    'ActionType': ActionType, //< 玩家动作
    'AgreementEvent': AgreementEvent, //\ 协议事件
    'OPREATE_TYPE': OPREATE_TYPE, //\ 当前操作
    'winType': winType, //\ 输赢结果
    'PlayerBgScale': PlayerBgScale, //\ 输赢结果
    'CarBackType': CarBackType, //\ 牌的背面
    'FD_MIN': FD_MIN, //\封顶-最小数
    'DIZHU_TYPE': DIZHU_TYPE, //\ 是否叫地主
    'CHUPAI_STATUS': CHUPAI_STATUS,// 玩家出牌状态
    'GAME_MODE': GAME_MODE, // 房间类型，钻石还是红包
    'createRoomInfo':createRoomInfo,//创建房间信息
    'REDOUBKE_TYPE': REDOUBKE_TYPE,// 玩家是否加倍
    'ROOM_RECONNECT': ROOM_RECONNECT,// 房间重连状态
    'DISSOLVE_TYPE': DISSOLVE_TYPE,//解散房间类型
    'CARD_TYPE': CARD_TYPE,// 牌类型

    'PY_OPREATE_TYPE': PY_OPREATE_TYPE,// 刨幺操作类型
    'PyBgScale': PyBgScale,// 刨幺缩放比例
    'SHORT_CHAT_TYPE': SHORT_CHAT_TYPE,// 短语类型
    'PyCreateRoomInfo': PyCreateRoomInfo,// 刨幺房间玩法信息
};