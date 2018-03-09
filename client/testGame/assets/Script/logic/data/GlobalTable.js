/************************************************************************
 * Copyright (c) 2016 App
 * Author    : Shao
 * Mail      : yi-shaoye@163.com
 * Date      : 2016-11-26
 * Use       : 数据表管理器
 ************************************************************************/
var BaseClass = require('BaseClass');

module.exports = cc.Class({
    extends: BaseClass,

    properties: {
        // 数据表容器
        $tableMap: null,
        // 初始化
        _init: false,
        // 回调函数
        _callback: null
    },

    // 构造函数
    ctor() {
        this.$tableMap = {};
    },
    // 检测是否初始化
    checkInit: function (callback) {
        if (this._init) {
            callback();
        } else {
            this._callback = callback;
        }
    },
    // 初始化数据表
    initGameTable: function () {
        // 初始化回调
        this._init = true;
        if (this._callback) {
            this._callback();
        }
    },

    // 注册数据表
    registerTable: function (table) {
        if (this.$tableMap[table]) {
            return;
        }
        var data = cc.loader.getRes('json/Static' + table);
        this.$tableMap[table] = data;
    },

    // 获取数据表
    getTable: function (table) {
        return this.$tableMap[table];
    },

    // 获取数据表数据
    getTableData: function (table, key) {
        if (this.$tableMap[table]) {
            return this.$tableMap[table][key];
        }
        return null;
    },

});
