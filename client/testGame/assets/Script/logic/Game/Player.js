/************************************************************************
 * Copyright (c) 2017 App
 * Author    : liji.liu
 * Mail        : liuliji1184899343@163.com
 * Date        : 2018-03-23
 * Use      : player脚本
 ************************************************************************/

var App = require('App');
var BasePlayer = require('BasePlayer');
cc.Class({
    extends: BasePlayer,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.loadNode();
    },

    /**
     * 初始化加载挂在玩家身上的节点
     */
    loadNode: function () {
        var nameLabel = sgm.MethodsUtils.getNodeChildObject(this.node, 'header?nameLabel',cc.Label);
        if (nameLabel) {// 结束时，自己出去的牌的节点
            this.nameLabel = nameLabel;
        }
    },

    // 隐藏不需要的节点
    removePlayer: function () {
        this._super();
        this.node.active = false;
    },
    setPlayerInfo: function (userData) {
        debugger;
        this.node.active = true;
        this.nameLabel.string = userData.nickName;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
