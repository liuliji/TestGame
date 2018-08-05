
cc.Class({
    extends: cc.Component,

    properties: {
        gameAtlas: cc.SpriteAtlas,// 卡牌的Atlas图集
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    setValue: function (value) {
        var spriteFrame = this.gameAtlas.getSpriteFrame('' + value);
        if (spriteFrame) {
            this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        }
    },
    // 筹码移动
    chipMove: function (startP = new cc.Vec2(0, 0), endP = new cc.Vec2(0, 0)) {
        this.node.setPosition(startP);

        var movAct = cc.moveTo(0.3, endP);
        this.node.runAction(movAct);
    },

    // update (dt) {},
});
