/************************************************************************
 * Copyright (c) 2016 App
 * Author    : Shao
 * Mail        : yi-shaoye@163.com
 * Date        : 2016-11-26
 * Use      : Revolve控件
 ************************************************************************/
var UIWindow = require('UIWindow');
var enWinType = require('UIWindowDef').enWinType;
var enCommonUI = require('UIWindowDef').enCommonUI;
var MethodsUtils = require('MethodsUtils');

cc.Class({
    extends: UIWindow,

    properties: {
        updownTips: cc.Prefab,//上下
    },
    /**
     * 初始化窗口
     */
    onInit: function () {
        // 注册ID
        this.windowID = enCommonUI.TipsUI;
        // 设置窗口类型
        this.windowType = enWinType.WT_Tips;

        this._super();
    },
    /**
     * 添加提示信息
     */
    addTips: function (str, effectType = 1, position, color, fontSize, isPrefab,animationTime,isFadeOut) {

        switch (effectType) {
            case 1: {
                this.showTipsDownToUp(str, position, color, fontSize, isPrefab,animationTime,isFadeOut);
                break;
            }
            case 2: {
                this.showTipsFromCenter(str, position, color, fontSize, isPrefab,animationTime);
                break;
            }
            default: {
                // TODO: Implemente default case
            }
        }
    },


    /**
     *  从下到上
     * @param string str 设置弹出的文字
     * @param position cc.v(0,0); 显示到的位置
     * @param cc.color color 文字颜色
     * @param int fontSize 文字大小
     * @param boolean isPrefab  是否使用预制体
     * @param int animationTime  动画播放时间
     * @param boolean isFadeOut true隐藏，false 开启
     */
    showTipsDownToUp: function (str, position, color, fontSize, isPrefab,animationTime,isFadeOut) {
        let moveto = cc.moveTo(animationTime, cc.v2(0, cc.winSize.height * 0.7));
        let sequ= null;
        if(isFadeOut){
            sequ = cc.sequence(moveto, cc.removeSelf(true));
        }else{
            let fadeout = cc.fadeOut(animationTime);
            let spawn = cc.spawn(moveto, fadeout);
            sequ = cc.sequence(spawn, cc.removeSelf(true));
        }

        if (isPrefab) {
            let array = sgm.Util.getStringLength(str);
            let strlength =array.z  + array.e/2+2;

            let prefab = cc.instantiate(this.updownTips);
            prefab.getComponent('TipsUpDownItem').setLabelString(str);
            prefab.getComponent('TipsUpDownItem').setLabelColor(color);
            prefab.getComponent('TipsUpDownItem').setLabelFontSize(fontSize);
            let initWidth = 151;
            let height = prefab.getContentSize().height;
            // Log.debug("height:" + height);
            prefab.setContentSize(initWidth + (strlength) * fontSize, height);

            prefab.setPosition(position);
            prefab.runAction(sequ);
            this.node.addChild(prefab);
        } else {
            var node = new cc.Node('sprite ' + this.count);
            var effectTips = node.addComponent(cc.RichText);
            effectTips.fontSize = fontSize;
            effectTips.string = str;
            node.setColor(color);
            node.setPosition(position);
            node.runAction(sequ);
            this.node.addChild(node);
        }

    },

    /**
     * 从外到里
     * @param string str 设置弹出的文字
     * @param position cc.v(0,0); 显示到的位置
     * @param cc.color color 文字颜色
     * @param int fontSize 文字大小
     * @param boolean isPrefab  是否使用预制体
     * @param int animationTime  动画播放时间
     */
    showTipsFromCenter: function (str, position, color, fontSize, isPrefab,animationTime) {
        let fadeout = cc.fadeOut(animationTime);
        let spawn = cc.sequence(fadeout);

        if (isPrefab) {
            let array = sgm.Util.getStringLength(str);
            let strlength =array.z  + array.e/2+2;

            let prefab = cc.instantiate(this.updownTips);
            prefab.getComponent('TipsUpDownItem').setLabelString(str);
            prefab.getComponent('TipsUpDownItem').setLabelColor(color);
            prefab.getComponent('TipsUpDownItem').setLabelFontSize(fontSize);
            let initWidth = 151;
            let height = prefab.getContentSize().height;
            prefab.setContentSize(initWidth+(strlength) * fontSize, height);
            prefab.setPosition(position);
            prefab.runAction(spawn);
            this.node.addChild(prefab);

        } else {
            var node = new cc.Node('sprite ' + this.count);
            var effectTips = node.addComponent(cc.RichText);
            effectTips.string = str;
            effectTips.fontSize = fontSize;
            node.setColor(color);
            node.setPosition(position);
            node.runAction(spawn);
            this.node.addChild(node);
        }
    }
});
