/************************************************************************
 * Copyright (c) 2017 App
 * Author    : liji.liu
 * Mail        : liuliji1184899343@163.com
 * Date        : 2018-03-15
 * Use      : 卡牌
 ************************************************************************/
cc.Class({
    extends: cc.Component,

    properties: {
        gameAtlas: cc.SpriteAtlas,// 卡牌的Atlas图集
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {

    },

    // 设置牌的值
    setCard: function (value) {
        var name = '';
        if (value == 0) {
            name = 'Pink';
        } else {
            name = '' + value;
        }
        this.node.getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame(name);
    },

    // 看牌特效
    watchCard: function (value, scaleFactor = 1) {
        var name = '';
        if (value == 0) {
            name = 'Pink';
        } else {
            name = '' + value;
        }
        // 先暂停所有的动作
        this.node.stopAllActions();
        var scale1 = cc.scaleTo(0.5, 0, scaleFactor);
        var scale1CallF = cc.callFunc(function () {
            this.node.getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame(name);
        }, this);
        var scale2 = cc.scaleTo(0.5, scaleFactor);
        var scale2CallF = cc.callFunc(function () {
            this.node.setScale(scaleFactor, scaleFactor);
        }, this);

        var seq = cc.sequence(scale1, scale1CallF, scale2, scale2CallF);
        this.node.runAction(seq);
    },

    // 弃牌
    onQiPai: function () {
        this.node.getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame('Pink_Gray1');
    },

    // update (dt) {},
});
