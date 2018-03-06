/************************************************************************
 * Copyright (c) 2016 App
 * Author    : Shao
 * Mail        : yi-shaoye@163.com
 * Date        : 2016-11-26
 * Use      : 游戏本地保存常量
 ************************************************************************/

/**
 * 保存密码账号
 */
var LoginStorage = {
    PASSWORD: "password",
    ACCOUNT: "account",
    RECORD_PASSWORD: "RecordPassword",//是否记录密码

    WECHAT_PASSWORD_OBJECT:'WechatPasswordObjectTest',//保存微信对象数据
};

/**
 * 声音大小
 */
var SetStorage={
    MUSIC_VOLUME:"musicVolume",
    SOUND_VOLUME:"soundVolume",
    TABLE_BG:"tableBg",         //桌面背景
    POKER_TYPE:"pokerType",     //扑克牌类型
    PLAY_METHOD:"playMethod",   //下注方式，滑动还是点击
    SHARE_METHOD:'shareMethod', //分享类型
    MUSIC_INDEX:'musicIndex',//背景音乐  0：默认  1，2
};


/**
 * 事件名称
 * @type {{}}
 */
var EventStorage = {
    PASSWORD_SAVE: "passwordSave",//密码保存
    MODIFY_PASSWORD: 'modifyPassword',//修改密码
    MODIFY_SEX: 'modifySex',//修改性别
    MODIFY_ICON: 'modifyIcon',//修改头像
    // MODIFY_TABLE_BG:'modifyTableBg',//修改桌面背景
};
/*
 * 其他保存数据
 */
var OtherStorage = {
    // activity
    ACTIVITY_NUMBER:'activityNumber',// 记录活动小标显示 1:保存,0是没有保存
    LOCAL_IP:'localIp',//本地ip
    PLAYER_GUIDE:'playerGuide', //新手引导
    SET_ZHUANG_TYPE:'setZhuangType',//设置庄类型   抢庄状态 1抢庄, 2不抢庄
    SHAKE_INDEX:'shakeIndex',//震动系数
    UPDATE_INTRODUCTION_MD5:'updateIntroductionMd5_CS',
    BLACK_LIST:'blacklist',//黑名单
    GAME_SENGMING_NOTICE:'gameShenMingNotice',//游戏声明-记录
    CUT_GAME_KJ_ICON:'cutGameKjIconWz',//是否切换开局图标
};
/**
 * 创建房间记录
 * @type {{IS_SAVE: string}}
 */
var CreateRoom = {
    CREATE_IS_SAVE: 'isSaveABTypeABType',
    CREATE_INNING_TYPE: 'inningTypeABType',//局数(3人房间)
    CREATE_ROOM_TYPE: 'roomTypeABType',//房间类型

    CREATE_JF_DAITI_TYPE: 'jfDaiTiypeABType',//叫分内容-带踢(3人房间)
    CREATE_JF_JUETOU_TYPE: 'jfCTypeABType',//叫分内容-撅头(3人房间)
    CREATE_JF_WANG_TYPE: 'wangCTypeABType',//叫分内容-2王(3人房间)

    CREATE_JD_TYPE: 'jdCTypeABType',//经典内容(3人房间)
    CREATE_FD_TYPE: 'fdTypeABType',//分数 封顶(3人房间)
    CREATE_TS_TYPE: 'tsTypeABType',//特殊 记牌器(3人房间)
    CREATE_GPS_TYPE: 'gpsTypeABType',//特殊 gps(3人房间)
    CREATE_JY_TYPE: 'jyTypeABType',//特殊 禁言(3人房间)

    CREATE_TITLE_LEFT_TYPE: 'titleLeftType',//创建房间人数标签

    ENTER_ROOM_ZR_TOGGLE: 'enterRoomZRToggle',//加入房间-正常房或随机房

    CREATE_MP_TYPE:'mpTypeABType',//特殊-明牌(3人房间)



    CREATE_TWO_IS_SAVE: 'isTwoSaveType',
    CREATE_TWO_INNING_TYPE: 'inningTypeTwoType',//局数(2人房间)
    CREATE_TWO_RANGPAI_TYPE: 'rangPaiTypeTwoType',//让牌(2人房间)
    CREATE_TWO_FENGDING_TYPE: 'fengDingTypeTwoType',//封顶(2人房间)

    CREATE_TWO_TYPE_TS_DPFB: 'tsTwoTypeDPFB',//特殊-底牌翻倍(2人房间)
    CREATE_TWO_TYPE_TS_BD: 'tsTwoTypeBD',//特殊-比调(2人房间)
    CREATE_TWO_TYPE_TS_JPQ: 'tsTwoTypeJPQ',//特殊-记牌器(2人房间)

    CREATE_TWO_TYPE_TS_MP:'tsTwoTypeMp',//特殊-明牌(2人房间)

};


/*
 * 其他保存数据
 */
var PyOtherStorage = {
    // activity
    ACTIVITY_NUMBER: 'py_activityNumber',// 记录活动小标显示 1:保存,0是没有保存
    LOCAL_IP: 'py_localIp',//本地ip
    PLAYER_GUIDE: 'py_playerGuide', //新手引导
    SET_ZHUANG_TYPE: 'py_setZhuangType',//设置庄类型   抢庄状态 1抢庄, 2不抢庄
    SHAKE_INDEX: 'py_shakeIndex',//震动系数
    UPDATE_INTRODUCTION_MD5: 'py_updateIntroductionMd5_CS',
    BLACK_LIST: 'py_blacklist',//黑名单


}

/**
 * 创建房间记录
 * @type {{IS_SAVE: string}}
 */
var PyCreateRoom = {
    CREATE_IS_SAVE: 'py_isSaveABTypeABType',
    CREATE_INNING_TYPE: 'py_inningTypeABType',//局数(4人房间)
    CREATE_ROOM_TYPE: 'py_roomTypeABType',//房间类型

    CREATE_TITLE_LEFT_TYPE: 'py_titleLeftType',//创建房间人数标签，4人或者2人


    CREATE_YAO_TYPE: 'py_yaoType',// 亮幺，不亮幺
    CREATE_DINGYAO_TYPE: 'py_dingYaoType',// 定幺，转幺
    CREATE_THREE_TYPE:'py_threeType',// 3大或者3小
    CREATE_TS_TYPE: 'py_tsTypeABType',//特殊 记牌器(4人房间)
    CREATE_GPS_TYPE: 'py_gpsTypeABType',//特殊 gps(4人房间)
    CREATE_JY_TYPE: 'py_jyTypeABType',//特殊 禁言(4人房间)

    ENTER_ROOM_ZR_TOGGLE: 'py_enterRoomZRToggle',//加入房间-正常房或随机房


    CREATE_TWO_IS_SAVE: 'py_isTwoSaveType',
    CREATE_TWO_INNING_TYPE: 'py_inningTypeTwoType',//局数(2人房间)

    CREATE_TWO_YAO_TYPE: 'py_yaoTypeTwo',// 亮幺，不亮幺
    CREATE_TWO_TYPE_TS_DPFB: 'py_tsTwoTypeDPFB',//特殊-底牌翻倍(2人房间)
    CREATE_TWO_TYPE_TS_BD: 'py_tsTwoTypeBD',//特殊-比调(2人房间)
    CREATE_TWO_TYPE_TS_JPQ: 'py_tsTwoTypeJPQ',//特殊-记牌器(2人房间)

}


module.exports = {
    LoginStorage: LoginStorage,//保存密码账号
    SetStorage: SetStorage,//声音大小
    EventStorage: EventStorage,//事件名称
    OtherStorage: OtherStorage,//其他保存数据
    CreateRoom: CreateRoom,//创建房间记录


    PyOtherStorage: PyOtherStorage,//其他保存数据
    PyCreateRoom: PyCreateRoom,// 刨幺创建房间记录
};
