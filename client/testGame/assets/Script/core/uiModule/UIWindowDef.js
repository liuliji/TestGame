/************************************************************************
 * Copyright (c) 2016 App
 * Author    : Shao
 * Mail        : yi-shaoye@163.com
 * Date        : 2016-11-26
 * Use      : UI管理系统-窗口属性
 ************************************************************************/

module.exports = cc.Class({
    statics: {
        /**
         * 窗口分类
         */
        enWinType: {
            WT_Normal: 0, //普通窗口
            WT_Fixed: 1,  //固定窗口
            WT_PopUp: 2,  //弹出窗口
            WT_Tips: 3    //提示窗口
        },
        /**
         * 窗口弹出类型
         */
        enWinShowType: {
            WST_None: 0,
            WST_HideOther: 1, //隐藏其他 闭其他界面
            WST_NeedBack: 2, //点击返回按钮关闭当前,不关闭其他界面(需要调整好层级关系)
            WST_NoNeedBack: 3, //关闭TopBar,关闭其他界面,不加入backSequence队列
        },
        /**
         * 通用UI控件
         */
        enCommonUI: {
            MessageBoxUI: -1, // 对话框
            AwaitUI: -2, // 等待
            TipsUI: -3, // 提示信息
            RevolveUI: -4, // 走马灯信息
        },
        /**
         * MessageBox类型
         */
        enMsgType: {
            None: 0, // 普通消息
            Message: 1, // 带返回值
        }
    }
});
