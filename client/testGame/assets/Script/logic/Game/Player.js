/************************************************************************
 * Copyright (c) 2017 App
 * Author    : liji.liu
 * Mail        : liuliji1184899343@163.com
 * Date        : 2018-03-23
 * Use      : player脚本
 ************************************************************************/

var App = require('App');
var BasePlayer = require('BasePlayer');
var Consts = require('Consts');
var CARD_SCALE = Consts.CARD_SCALE;// 卡牌的缩放值

cc.Class({
    extends: BasePlayer,

    properties: {
        cardPrefab: cc.Prefab,// 卡牌的prefab
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.playerInit();
    },

    /**
     * 玩家信息初始化
     */
    playerInit: function () {
        // 设置player身上的初始数据，这些数据不在properties中显示
        this.initValue();
        // 动态加载节点
        this.loadNode();
    },

    /**
     * 初始化加载挂在玩家身上的节点
     */
    loadNode: function () {
        var nameLabel = sgm.MethodsUtils.getNodeChildObject(this.node, 'header?nameLabel', cc.Label);
        if (nameLabel) {// 结束时，自己出去的牌的节点
            this.nameLabel = nameLabel;
        }
        var readyNode = sgm.MethodsUtils.getNodeChildObject(this.node, 'header?icon_ready');
        if (readyNode) {// 结束时，自己出去的牌的节点
            this.readyNode = readyNode;
        }
        // 发牌的起始位置
        var startNode = sgm.MethodsUtils.getNodeChildObject(this.node, 'startP');
        if (startNode) {
            this.startNode = startNode;
        }
        // 房主icon
        var roomOwnerNode = sgm.MethodsUtils.getNodeChildObject(this.node, 'header?roomOwner');
        if (roomOwnerNode) {
            this.roomOwnerNode = roomOwnerNode;
        }
        // 看牌节点
        var operateLabel = sgm.MethodsUtils.getNodeChildObject(this.node, 'header?operateLabel', cc.Label);
        if (operateLabel) {
            this.operateLabel = operateLabel;
        }

    },

    /**
     * 数据初始化
     */
    initValue: function () {
        this.playerName = this.node.getName();
        this.isSelf = false;// 判断玩家是不是自己
        if (this.playerName == 'player_me') {
            this.isSelf = true;
        }
        this.cards = [];// 用来保存扑克牌
    },

    // 隐藏不需要的节点
    removePlayer: function () {
        this._super();
        this.node.active = false;
    },

    /**
     * 设置玩家的基本信息
     */
    setPlayerInfo: function (userData) {
        // debugger;
        this.node.active = true;
        this.nameLabel.string = userData.userName;
        if (userData.readyStatus) {
            this.readyNode.active = true;
        } else {
            this.readyNode.active = false;
        }
        if (userData.roomOwner) {
            this.roomOwnerNode.active = true;
        } else {
            this.roomOwnerNode.active = false;
        }
    },

    /**
     * 设置玩家的ready状态
     */
    setPlayerReady: function (ready) {
        if (this.readyNode) {// 存在准备按钮
            if (ready) {
                this.readyNode.active = true;
            } else {
                this.readyNode.active = false;
            }
        }
    },

    /**
     * 获取当前玩家的名字，player_me,player_1,player_2,player_3,player_4
     */
    getPlayerName: function () {
        return this.playerName;
    },

    /**
     * 发牌逻辑
     */
    sendCard: function (cards) {
        var cardScale = CARD_SCALE.OTHER;// 卡牌的缩放，便于以后的整体调节，防止多个地方使用造成修改麻烦
        var cardDir = 1;// 1表示向右，-1表示向左
        // 对自已、左右玩家进行判断
        if (this.isSelf) {
            cardScale = CARD_SCALE.SELF;
            cardDir = 1;
        } else {
            cardScale = CARD_SCALE.OTHER;
            if (this.getPlayerName() == 'player_1' || this.getPlayerName() == 'player_2') {
                cardDir = -1;
            } else {
                cardDir = 1;
            }
        }
        // 创建扑克牌
        for (var i = 0; i < cards.length; i++) {
            var value = cards[i];
            var card = cc.instantiate(this.cardPrefab);
            if (card) {// 创建扑克牌，并设置扑克牌的值
                var cardCom = card.getComponent('Card');
                card.setScale(cardScale);
                cardCom.setCard(value);
                // 根据缩放值，设置卡牌的位置
                card.setPosition(this.startNode.position.x + i * card.width * cardScale, 0);
                this.cards.push(card);
                this.node.addChild(card);
            }

        }
    },

    // 获取扑克牌的位置
    getCardP: function () {
        var cardScale = CARD_SCALE.SELF;
        if (this.isSelf) {
            cardScale = CARD_SCALE.SELF;
        } else {
            cardScale = CARD_SCALE.OTHER;
        }
        var x = this.startNode.position.x + this.cards[0].width * cardScale + this.node.position.x;
        var y = 0 + this.node.position.y;
        return new cc.Vec2(x, y);
    },

    rmCards: function () {
        for (var i = this.cards.length - 1; i >= 0; i--) {
            if (this.cards[i]) {
                this.cards[i].destroy();
            }
        }
        this.cards = [];
    },

    // 看牌
    watchCard: function (cards) {
        // 扑克牌数目和看牌的牌的数据不一致，就删除重新创建扑克牌
        if (cards.length != this.cards.length) {
            this.rmCards();
            this.sendCard(cards);
        }
        // 执行扑克牌看牌动画
        var cardScale = CARD_SCALE.SELF;
        if (this.isSelf) {
            cardScale = CARD_SCALE.SELF;
        } else {
            cardScale = CARD_SCALE.OTHER;
        }
        for (var i = 0; i < cards.length; i++) {
            let card = this.cards[i];
            if (card) {
                var cardCom = card.getComponent('Card');
                cardCom.watchCard(cards[i], cardScale);
            }
        }
    },

    // 其他人看牌
    otherWatchCard: function () {
        this.operateLabel.string = '看牌';
    },

    // 玩家弃牌
    onQiPai: function () {
        // // 扑克牌数目和看牌的牌的数据不一致，就删除重新创建扑克牌
        // if (cards.length != 3) {
        //     this.rmCards();
        //     this.sendCard([0, 0, 0]);
        // }
        // 执行扑克牌看牌动画
        var cardScale = CARD_SCALE.SELF;
        if (this.isSelf) {
            cardScale = CARD_SCALE.SELF;
        } else {
            cardScale = CARD_SCALE.OTHER;
        }
        for (var i = 0; i < this.cards.length; i++) {
            let card = this.cards[i];
            if (card) {
                var cardCom = card.getComponent('Card');
                cardCom.onQiPai();
            }
        }
        this.operateLabel.string = '扣牌';
    },

    // 比牌开始，隐藏自己的牌
    biPaiHideCard: function () {
        for (var i = 0; i < this.cards.length; i++) {
            let card = this.cards[i];
            if (card) {
                card.active = false;
            }
        }
    },
    // 比牌结束，显示玩家的牌，并设置牌的显示
    biPaiShowCard: function (cards) {
        for (var i = 0; i < this.cards.length; i++) {
            let card = this.cards[i];
            if (card) {
                card.active = true;
                var value = cards[i];
                var cardCom = card.getComponent('Card');
                cardCom.setCard(value);
            }
        }

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
