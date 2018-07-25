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
        this.spriteFrame = this.node.getComponent(cc.Sprite).spriteFrame;
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
        this.spriteFrame = this.gameAtlas.getSpriteFrame(name);
    },

    // update (dt) {},
});
