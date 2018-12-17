/************************************************************************
 * Copyright (c) 2017 App
 * Author    : liji.liu
 * Mail        : liuliji1184899343@163.com
 * Date        : 2018-03-23
 * Use      : gameview房间的游戏主逻辑
 ************************************************************************/

var App = require('App');
var BaseGameView = require('BaseGameView');
var enViewType = require('Consts').enViewType;
var Event = require('Consts').AgreementEvent;
var Consts = require('Consts');
var RoomSendMsgs = require('RoomSendMsgs');
var ChipManager = require('ChipManager');// 筹码管理器，
var CARD_SCALE = Consts.CARD_SCALE;// 卡牌的缩放值
var ROOM_STATUS = require('Consts').ROOM_STATUS;// 房间状态

cc.Class({
    extends: BaseGameView,

    properties: {
        chipPrefab: cc.Prefab,// 筹码的prefab
        cardPrefab: cc.Prefab,// 扑克牌的prefab
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        App.MsgDispatcher.setCanProcessMsg(false);
        this.gameInit();
    },

    gameInit: function () {
        // 数据初始化
        this.initValue();
        // 先动态获取当前页面的所有控件
        this.getNodes();
        // 基本的初始化操作
        this.basicInit();
        // 注册事件监听
        this.gameEventRegist();
    },

    start: function () {
        this.onReconnect();
    },

    // 数据初始化
    initValue: function () {
        this.operateOffset = 100;// 操作面板的偏移量
        ChipManager.getInstance().setPrefab(this.chipPrefab);// 筹码管理器初始化管理的prefab
        var room = App.UserManager.getRoom();
        if (!room){
            return;
        }
        // room.status = ROOM_STATUS.FIRST_BEGIN;
    },

    basicInit: function () {
        // 显示房间号
        if (this.roomIdLabel) {
            var roomObj = App.UserManager.getRoom();
            if (roomObj) {
                this.roomIdLabel.string = roomObj.roomId;
            }
        }
        var selfData = App.UserManager.getSelf();
        if (!selfData) {
            return;
        }
        if (!selfData.roomOwner && !selfData.readyStatus) {
            this.setReadyIsShow(true);
        } else {
            this.setReadyIsShow(false);
        }
    },

    // 游戏时间注册
    gameEventRegist: function () {
        this.node.on("reconnect",this.onReconnect.bind(this));

        this.node.on(Event.AGS_JOIN_ROOM, this.onPlayerJoin.bind(this));
        this.node.on(Event.AGS_TALK, this.onPlayerTalk.bind(this));
        this.node.on(Event.AGS_READY, this.onPlayerReady.bind(this));
        this.node.on(Event.AGS_FAPAI, this.onFaPai.bind(this));
        this.node.on(Event.AGS_ACTION_INFO, this.onActionInfo.bind(this));
        this.node.on(Event.AGS_HIDE_OPERATE, this.onHideOperate.bind(this));

        this.node.on(Event.AGS_KAN_PAI, this.onKanPai.bind(this));
        this.node.on(Event.AGS_OTHER_KAN_PAI, this.onOtherKanPai.bind(this));
        this.node.on(Event.AGS_YA_ZHU, this.onYaZhu.bind(this));
        this.node.on(Event.AGS_OTHER_YA_ZHU, this.onOtherYaZhu.bind(this));
        this.node.on(Event.AGS_YA_ZHU_FAILED, this.onYaZhuFailed.bind(this));
        this.node.on(Event.AGS_QI_PAI, this.onQiPai.bind(this));
        this.node.on(Event.AGS_OTHER_QI_PAI, this.onOtherQiPai.bind(this));
        this.node.on(Event.AGS_GAME_RESULT, this.onGameResult.bind(this));
        this.node.on(Event.AGS_OTHER_LEAVE, this.onOtherLeave.bind(this));
    },

    // 动态获取控件
    getNodes: function () {
        // debugger;
        // 开始游戏按钮
        this.btnStart = null;
        var btnStart = sgm.MethodsUtils.getNodeChildObject(this.node, 'bottomLayer?btnStart');
        if (btnStart) {
            this.btnStart = btnStart;
        }
        // 准备按钮
        this.btnReady = null;
        var btnReady = sgm.MethodsUtils.getNodeChildObject(this.node, 'bottomLayer?btnReady');
        if (btnReady) {
            this.btnReady = btnReady;
        }
        // 操作面板
        this.operateLayer = null;
        var operateLayer = sgm.MethodsUtils.getNodeChildObject(this.node, 'operateLayer');
        if (operateLayer) {
            this.operateLayer = operateLayer;
            var winSize = cc.director.getWinSize();
            var winHeight = winSize.height;
            var height = this.operateLayer.height;
            this.operateLayer.y = - winHeight / 2 - height / 2 - this.operateOffset;

        }
        // 操作面板上的按钮
        this.buttonWatch = null;// 看牌
        var buttonWatch = sgm.MethodsUtils.getNodeChildObject(this.node, 'operateLayer?layout?buttonWatch', cc.Button);
        if (buttonWatch) {
            this.buttonWatch = buttonWatch;
        }
        this.buttonBet = null;// 押注
        var buttonBet = sgm.MethodsUtils.getNodeChildObject(this.node, 'operateLayer?layout?buttonBet', cc.Button);
        if (buttonBet) {
            this.buttonBet = buttonBet;
        }
        this.buttonGiveUp = null;// 扣牌
        var buttonGiveUp = sgm.MethodsUtils.getNodeChildObject(this.node, 'operateLayer?layout?buttonGiveUp', cc.Button);
        if (buttonGiveUp) {
            this.buttonGiveUp = buttonGiveUp;
        }
        this.buttonOpen = null;// 开牌
        var buttonOpen = sgm.MethodsUtils.getNodeChildObject(this.node, 'operateLayer?layout?buttonOpen', cc.Button);
        if (buttonOpen) {
            this.buttonOpen = buttonOpen;
            // this.buttonOpen.interactable = false;
        }

        this.chipLayer = null;// 筹码节点
        var chipLayer = sgm.MethodsUtils.getNodeChildObject(this.node, 'chipLayer');
        if (chipLayer) {
            this.chipLayer = chipLayer;
            // this.buttonOpen.interactable = false;
        }

        this.pkNode = null;// PK节点，播放PK动画
        var pkNode = sgm.MethodsUtils.getNodeChildObject(this.node,'pkNode',cc.Sprite);
        if (pkNode){
            this.pkNode = pkNode;
        }

    },

    onTest: function(){
        let room = App.UserManager.getRoom();
        room.isReconnect = 2;
        debugger;
        this.onReconnect();
    },

    onReconnect: function(){
        let room = App.UserManager.getRoom();
        if (!room){
            return;
        }
        if (!room.isReconnect){
            return;
        }
        this.onReconnectInitPlayer();
        this.setPlayerReadyStatus();
        switch (room.status){
            case ROOM_STATUS.FIRST_BEGIN:
                this.onReconnectFirstBegin();
            break;
            case ROOM_STATUS.GAMING:
                this.onReconnectSetPokers();
                this.onReconnectGaming();
            break;
            case ROOM_STATUS.READY:
                this.onReconnectReady();
                this.onRemoveAllChips();
            break;
        }
    },

    onReconnectInitPlayer: function(){
        for (var i = 0; i < this.playerMgr.length; i ++){
            let player = this.playerMgr[i];
            let userData = App.UserManager.getAllUserData(i);
            if (userData){
                player.setPlayerInfo(userData, true);;
            } else {
                player.removePlayer();
            }
        }
        // App.UserManager.foreachAllUser((userData)=> {
        //     this.playerMgr[userData.position].setPlayerInfo(userData, true);
        // });
    },

    // 从firstBegin重连
    onReconnectFirstBegin: function(){
        let room = App.UserManager.getRoom();
        this.isAllReady();
        // this.setPlayerReadyStatus();
    },

    setPlayerReadyStatus: function(){
        App.UserManager.foreachAllUser(function (userData) {
            if (userData){
                this.playerMgr[userData.position].setPlayerReady(userData.readyStatus);
            }
        }.bind(this));
    },

    // 从gaming重连
    onReconnectGaming: function(){
        let room = App.UserManager.getRoom();
        this.onReconnectSetPokers();
        this.onReconnectSetChips();

        this.onActionInfo({detail: room.actions});
    },

    onReconnectSetPokers: function(){
        App.UserManager.foreachAllUser((userData)=> {
            this.playerMgr[userData.position].sendCard(userData.pokers);
        });
    },

    onReconnectSetChips: function(){
        let room = App.UserManager.getRoom();

        var chips = room.chips;
        var chipNumbers = [5, 2, 1];
        for (var k = 0; k < chips.length; k ++){
            let value = chips[k].value;
            if (!value){
                continue;
            }
            for (var i = 0; i < chipNumbers.length; i++) {
                var cNumber = chipNumbers[i];
                var count = Math.floor(value / cNumber);
                value = value % cNumber;
                for (var j = 0; j < count; j++) {
                    var x = ChipManager.getInstance().seededRandom(-200, 200);
                    var y = ChipManager.getInstance().seededRandom(-100, 100);
                    var endP = new cc.Vec2(x, y);
                    let chipNode = ChipManager.getInstance().createChipWithPosition(cNumber, endP);
                    this.chipLayer.addChild(chipNode);
                }
            }
        }
        
    },

    // 从ready重连
    onReconnectReady: function(){
        let room = App.UserManager.getRoom();
        this.isAllReady();
        let selfData = App.UserManager.getSelf();
        if (!selfData){
            return;
        }
        if (!selfData.readyStatus){
            this.onReconnectSetPokers();
        } else {
            this.setReadyIsShow(false);
        }

    },

    // 准备
    onReady: function () {
        this.setReadyIsShow(false);
        this.onRemoveAllChips();
        RoomSendMsgs.onReady();
    },

    onRemoveAllChips: function(){
        ChipManager.getInstance().clean();
    },

    // 开始
    onStart: function () {
        RoomSendMsgs.onStartGame();
    },

    setReadyIsShow: function (isShow) {
        if (this.btnReady) {
            this.btnReady.active = isShow;
        }
        App.UserManager.foreachAllUser((userData)=> {
            if (userData){
                var position = userData.position;
                this.playerMgr[position].rmCards();
            }
        });
    },

    // 玩家加入房间
    onPlayerJoin: function (event) {
        var userData = event.detail;
        Log.debug('玩家加入房间：' + JSON.stringify(userData));
        if (!userData) {
            return;
        }
        // 初始化自己信息
        this.playerAry[userData.position].setPlayerInfo(userData, true);
        /**
         * 如果有人准备了，这个时候，又有人进入房间的话，那么房主的准备按钮就需要隐藏掉，
         * 这里使用统一的逻辑进行处理，判断玩家是否都准备了，同时，根据房间的状态、是否是第一局
         * 等信息进行判断，直接对开始和准备按钮进行显示和隐藏
         */
        this.isAllReady();
    },

    // 别人离开房间
    onOtherLeave: function(event){
        let position = event.detail;
        this.removePlayer(position);
    },

    // 玩家说话
    onPlayerTalk: function (event) {
        var args = event.detail;
        Log.debug('玩家加入房间：' + JSON.stringify(args));
    },

    /**
     * 玩家点击准备按钮
     */
    onPlayerReady: function (event) {
        // debugger;
        var position = event.detail;
        var userData = App.UserManager.getAllUserData(position);
        if (userData) {// 设置玩家已准备

            this.playerMgr[position].setPlayerReady(userData.readyStatus);

        }
        this.isAllReady();
        Log.debug('有玩家点击了准备按钮');
    },

    /**
     * 发牌消息
     */
    onFaPai: function () {
        var room = App.UserManager.getRoom();
        if (!room){
            return;
        }
        room.setRoomStatus(ROOM_STATUS.GAMING);
        this.btnStart.active = false;
        this.btnReady.active = false;
        App.UserManager.foreachAllUser(function (userData) {
            if (userData) {
                // 给玩家发牌
                var position = userData.position;
                var player = this.playerMgr[position];
                if (player) {
                    player.sendCard(userData.pokers);
                    // 隐藏已准备图标
                    player.setPlayerReady(false)
                }
            }
        }.bind(this));
    },

    /**
     * 玩家操作信息
     */
    onActionInfo: function (event) {
        var args = event.detail;
        var actions = args.actions;
        var position = args.position;

        var actionAry = [];
        // 开始遍历，处理玩家可以进行那些操作
        for (var i = 0; i < actions.length; i++) {
            actionAry.push(actions[i].aId);
        }

        // 看牌
        if (this.inArray(actionAry, 1)) {
            this.buttonWatch.interactable = true;
        } else {
            this.buttonWatch.interactable = false;
        }

        // 押注
        if (this.inArray(actionAry, 2)) {
            this.buttonBet.interactable = true;
        } else {
            this.buttonBet.interactable = false;
        }

        // 扣牌
        if (this.inArray(actionAry, 3)) {
            this.buttonGiveUp.interactable = true;
        } else {
            this.buttonGiveUp.interactable = false;
        }

        // 开牌
        if (this.inArray(actionAry, 4)) {
            this.buttonOpen.interactable = true;
        } else {
            this.buttonOpen.interactable = false;
        }

        var actionPositions = args.actionPositions;
        var selfData = App.UserManager.getSelf();
        if (selfData) {
            if (selfData.position == actionPositions) {
                this.moveUpOperateLayer();
            }
        } else {
            this.moveDownOperateLayer();
        }


    },

    // 操作面板移动
    moveUpOperateLayer: function () {
        var winSize = cc.director.getWinSize();
        var winHeight = winSize.height;
        var height = this.operateLayer.height;

        this.operateLayer.stopAllActions();
        // this.operateLayer.setPositionY(- winHeight / 2 - height / 2 - this.operateOffset);

        var mov1 = cc.moveTo(0.5, new cc.Vec2(0, - winHeight / 2 + height / 2));
        var calF = cc.callFunc(function () {
            this.operateLayer.setPosition(new cc.Vec2(0, - winHeight / 2 + height / 2));
        }, this);

        var seq = cc.sequence(mov1, calF);
        this.operateLayer.runAction(seq);
    },

    // 操作面板移出
    moveDownOperateLayer: function () {
        var winSize = cc.director.getWinSize();
        var winHeight = winSize.height;
        var height = this.operateLayer.height;

        this.operateLayer.stopAllActions();
        // this.operateLayer.setPositionY(- winHeight / 2 + height / 2);
        this.operateLayer.y = (- winHeight / 2 + height / 2);

        var mov1 = cc.moveTo(0.5, new cc.Vec2(0, - winHeight / 2 - height / 2 - this.operateOffset));
        var calF = cc.callFunc(function () {
            this.operateLayer.setPosition(new cc.Vec2(0, - winHeight / 2 - height / 2 - this.operateOffset));
        }, this);

        var seq = cc.sequence(mov1, calF);
        this.operateLayer.runAction(seq);
    },

    //判断数组中是否存在某个变量
    inArray: function (array, value) {
        for (var i = 0; i < array.length; i++) {

            if (array[i] == value) {

                return true;

            }

        } return false;
    },

    /**
     * 判断是否所有的玩家都已经准备好了
     */
    isAllReady: function () {
        var allReady = true;
        let others = App.UserManager.getOtherUserAry();
        if (others.length == 0){
            allReady = false;
        }
        var selfData = App.UserManager.getSelf();
        if (selfData && selfData.roomOwner) {
            App.UserManager.foreachOtherUser(function (userData) {
                if (userData) {
                    if (userData.readyStatus == false) {
                        allReady = false;
                    }
                }
            }.bind(this));
        }
        var room = App.UserManager.getRoom();
        if (!room){
            return;
        }
        if (selfData && selfData.roomOwner) {// 自己如果是房主的话
            if (room.status == ROOM_STATUS.FIRST_BEGIN){
                if (allReady) {
                    this.btnStart.active = true;
                } else {
                    this.btnStart.active = false;
                }
            } else if (room.status == ROOM_STATUS.GAMING){
                this.btnStart.active = false;
                this.btnReady.active = false;
            } else if (room.status == ROOM_STATUS.READY){
                this.btnStart.active = false;
                if (!selfData.readyStatus){
                    this.btnReady.active = true;
                } else {
                    this.btnReady.active = false;                    
                }
            }
            
        } else {// 自己不是房主的话
            if (room.status == ROOM_STATUS.FIRST_BEGIN){
                if (selfData.readyStatus == true) {// 自己已经准备了，就全都隐藏
                    this.btnStart.active = false;
                    this.btnReady.active = false;
                } else {// 自己还么准备就只显示准备按钮
                    this.btnStart.active = false;
                    this.btnReady.active = true;
                }
            } else if (room.status == ROOM_STATUS.GAMING){
                this.btnStart.active = false;
                this.btnReady.active = false;
            } else if (room.status == ROOM_STATUS.READY){
                this.btnStart.active = false;
                if (selfData.readyStatus){
                    this.btnReady.active = false;
                } else {
                    this.btnReady.active = true;
                }
            }
            

        }

    },

    /**
     * 菜单按钮事件
     */
    onGameMenu: function () {
        App.UIManager.showWindow(enViewType.GameMenuUI);
    },

    // 看牌
    onWatch: function () {
        this.buttonWatch.interactable = false;
        RoomSendMsgs.onActionExecute(1);
        // this.moveDownOperateLayer();
    },

    // 押注
    onBet: function () {
        App.UIManager.showWindow(enViewType.BetUI);
    },

    // 扣牌
    onGiveUp: function () {
        RoomSendMsgs.onActionExecute(3);
        this.moveDownOperateLayer();
    },

    // 开牌
    onOpen: function () {
        RoomSendMsgs.onActionExecute(4);
        this.moveDownOperateLayer();
    },

    // 隐藏操作面板
    onHideOperate: function () {
        this.moveDownOperateLayer();
    },
    // 自己看牌
    onKanPai: function (event) {
        var selfData = App.UserManager.getSelf();
        if (!selfData) {
            return;
        }
        var selfPlayer = this.playerMgr[selfData.position];
        if (!selfPlayer) {
            return;
        }
        selfPlayer.watchCard(selfData.pokers);
    },
    // 别人看牌
    onOtherKanPai: function (event) {
        var args = event.detail;
        var pos = args.pos;
        var userData = App.UserManager.getAllUserData(pos);
        if (!userData) {
            return;
        }
        var player = this.playerMgr[userData.position];
        if (!player) {
            return;
        }
        player.otherWatchCard();
    },
    // 创建筹码
    onPlayerCreateChip: function (playerNode, value) {
        var startP = playerNode.position;
        var chipNumbers = [5, 2, 1];
        for (var i = 0; i < chipNumbers.length; i++) {
            var cNumber = chipNumbers[i];
            var count = Math.floor(value / cNumber);
            value = value % cNumber;
            for (var j = 0; j < count; j++) {
                var chipNode = ChipManager.getInstance().createChip();
                var chip = chipNode.getComponent('Chip');
                chip.setValue(cNumber);
                var x = ChipManager.getInstance().seededRandom(-200, 200);
                var y = ChipManager.getInstance().seededRandom(-100, 100);
                var endP = new cc.Vec2(x, y);
                this.chipLayer.addChild(chipNode);
                chip.chipMove(startP, endP);
            }
        }

    },
    // 自己押注
    onYaZhu: function (event) {
        var args = event.detail;
        var count = args.count;
        var selfData = App.UserManager.getSelf();
        if (!selfData) {
            return;
        }
        var selfPlayer = this.playerMgr[selfData.position];
        if (!selfPlayer) {
            return;
        }
        this.onPlayerCreateChip(selfPlayer.node, count);
    },
    // 别人押注
    onOtherYaZhu: function (event) {
        var args = event.detail;
        var pos = args.pos;
        var count = args.count;
        var userData = App.UserManager.getAllUserData(pos);
        if (!userData) {
            return;
        }
        var player = this.playerMgr[userData.position];
        if (!player) {
            return;
        }
        this.onPlayerCreateChip(player.node, count);
    },
    // 押注失败
    onYaZhuFailed: function (event) {

    },
    // 自己弃牌
    onQiPai: function (event) {
        var selfData = App.UserManager.getSelf();
        if (!selfData) {
            return;
        }
        var selfPlayer = this.playerMgr[selfData.position];
        if (!selfPlayer) {
            return;
        }
        selfPlayer.onQiPai();
    },
    // 别人弃牌
    onOtherQiPai: function (event) {
        var args = event.detail;
        var pos = args.pos;
        var userData = App.UserManager.getAllUserData(pos);
        if (!userData) {
            return;
        }
        var player = this.playerMgr[userData.position];
        if (!player) {
            return;
        }
        player.onQiPai();
    },
    // 开牌
    onGameResult: function (event) {
        this.moveDownOperateLayer();
        var winPosition = -1;
        App.UserManager.foreachAllUser(function (userData) {
            if (userData.deltaMoney > 0) {
                winPosition = userData.position;
            }
        }.bind(this));
        if (winPosition < 0){
            return;
        }

        // 开始做玩家比牌动画
        var calF1 = cc.callFunc(function () {
            // 先把玩家的牌隐藏
            App.UserManager.foreachAllUser(function (userData) {
                if (!userData) {
                    return;
                }
                var player = this.playerMgr[userData.position];
                if (!player) {
                    return;
                }
                player.biPaiHideCard();
            }.bind(this));
        }, this);

        /**
         * 在每个玩家牌的位置创建几张牌，然后移动到屏幕中间，碰撞一下播放一个动画，
         * 最后再飞回起始位置，然后再把玩家的牌显示出来，再播放筹码移动的特效，
         * 完成本次结算
         */

        var calF2 = cc.callFunc(function () {
            // 再把玩家的牌显示出来
            App.UserManager.foreachAllUser(function (userData) {
                if (!userData) {
                    return;
                }
                var player = this.playerMgr[userData.position];
                if (!player) {
                    return;
                }
                var startP = player.getCardP();
                // var cards = [];
                var cardScale = CARD_SCALE.OTHER;
                for (var i = 0; i < 3; i++) {
                    var card = cc.instantiate(this.cardPrefab);
                    card.setPosition(new cc.Vec2(startP.x + (i - 1) * card.width * cardScale, startP.y));
                    this.chipLayer.addChild(card);

                    // 移动到中间
                    var act1 = cc.moveTo(0.4, new cc.Vec2(0, 0));
                    var delayT0 = cc.delayTime(0.5);
                    var act2 = cc.moveTo(0.4, new cc.Vec2(startP.x + (i - 1) * card.width * cardScale, startP.y));
                    var delayT1 = cc.delayTime(0.2);
                    var rm = cc.removeSelf();
                    var seq1 = cc.sequence(act1, delayT0, act2, delayT1, rm);
                    card.runAction(seq1);
                }
            }.bind(this));
        }, this);

        var delayT = cc.delayTime(1.6);
        var spaw1 = cc.spawn(calF2, delayT);

        // 最后所有玩家的牌都显示出来
        var calF_final = cc.callFunc(function () {
            // 再把玩家的牌显示出来
            App.UserManager.foreachAllUser(function (userData) {
                if (!userData) {
                    return;
                }
                var player = this.playerMgr[userData.position];
                if (!player) {
                    return;
                }
                player.biPaiShowCard(userData.pokers);
            }.bind(this));
        }, this);

        var calF_chip = cc.callFunc(function () {
            ChipManager.getInstance().chipMove(this.playerMgr[winPosition].node.position);

            // 比牌结束后，变为准备装填
            var room = App.UserManager.getRoom();
            if (room){
                room.setRoomStatus(ROOM_STATUS.READY);
            }        
            this.isAllReady();
        }, this);

        var seq = cc.sequence(calF1, spaw1, calF_final, calF_chip);
        this.node.runAction(seq);

        // 播放PK动画
        this.playPkAnimation();
    },

    // 播放PK动画
    playPkAnimation: function(){
        if (!this.pkNode){
            return;
        }
        this.pkNode.node.active = true;
        var anim = this.pkNode.getComponent(cc.Animation);
        anim.play("pk");
        anim.on('stop',() => {
            if (this.pkNode && this.pkNode.node){
                this.pkNode.node.active = false;
            }
        });
    },

    // 测试按钮
    testButton: function () {
        var selfData = App.UserManager.getSelf();
        if (!selfData) {
            return;
        }
        var selfPlayer = this.playerMgr[selfData.position];
        if (!selfPlayer) {
            return;
        }
        selfPlayer.watchCard([1, 2, 3]);
    },

    update: function (dt) {
        App.MsgDispatcher.processMessage(this);
    },
});
