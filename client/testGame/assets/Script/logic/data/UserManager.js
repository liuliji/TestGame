/************************************************************************
 * Copyright (c) 2017 cardgame
 * Author      : Lee
 * Mail        : crazycode_lee@163.com
 * Date        : 2017-4-16
 * Use         : 用户数据管理
 ************************************************************************/

var UserData = require('UserData');
var RoomData = require('RoomData');

var UserManager = cc.Class({
    properties: {
        roomObj: null,    //< 房间数据
        selfData: null,   //< 自己数据
        otherUserAry: null, //< 别人数据
    },

    ctor: function () {
        this.roomObj = null;    //< 房间数据
        this.selfData = null;   //< 自己数据
        this.otherUserAry = [];
    },
    /**
     * 创建房间对象
     * @param room
     * @returns {RoomData}
     */
    setRoom: function (room) {
        if (!this.roomObj) {
            this.roomObj = new RoomData();
        }
        this.roomObj.setRoomBase(room);
        return this.roomObj;
    },

    /**
     * 获取房间对象
     * @returns {RoomData}
     */
    getRoom: function () {
        return this.roomObj;
    },

    /**
     * 设置当前玩家(主角)
     * @param info
     * @returns {UserData}
     */
    setSelf: function (info) {
        if (!this.selfData) {
            this.selfData = new UserData();
            this.selfData.initPlayerInfo(info);
            this.selfData.setUserDataInfo(info);
        } else {
            this.selfData.initPlayerInfo(info);
        }
        return this.selfData;
    },

    /**
     * 获取当前玩家(主角)
     * @returns {UserData}
     */
    getSelf: function () {
        return this.selfData;
    },
    /**
     * 获取其他玩家(不包括主角)
     * @param position
     * @returns {*}
     */
    getOtherUser: function (position) {
        if (this.otherUserAry[position]) {
            return this.otherUserAry[position];
        } else {
            Log.warn('获取其他玩家-不包括主角-->没有[' + position + ']玩家');
            return null
        }
    },

    /**
     * 设置其他玩家(不包括主角)
     * @param info
     * @returns {*}
     */
    setOtherUser: function (info) {
        var position = info.position;
        if (!this.otherUserAry[position]) {
            this.otherUserAry[position] = new UserData();
            this.otherUserAry[position].initPlayerInfo(info);
            this.otherUserAry[position].setUserDataInfo(info);
        } else {
            this.otherUserAry[position].initPlayerInfo(info);
        }
        return this.otherUserAry[position];
    },

    /**
     * 获取管理其他玩家数据对象
     * @returns {[UserData]}
     */
    getOtherUserAry: function () {
        return this.otherUserAry;
    },

    /**
     * 获取所有玩家数据(主角和其他人)
     * @param position
     * @returns {*}
     */
    getAllUserData: function (position) {
        if (this.selfData) {
            if (this.selfData.position == position) {
                return this.selfData;
            }
        }
        return this.getOtherUser(position);
    },

    /**
     * 遍历其他玩家(不包括主角)
     * @param callback
     */
    foreachOtherUser: function (callback) {
        for (var i in this.otherUserAry) {
            if (this.otherUserAry[i]) {
                callback(this.otherUserAry[i]);
            }
        }
    },
    /**
     * 遍历全部玩家(主角和其他人)
     * @param callback
     */
    foreachAllUser: function (callback) {
        if (this.selfData) {
            callback(this.selfData);
        }
        this.foreachOtherUser(callback);
    },
    /**
     * 获取其他玩家个数(不包括主角)
     * @returns {number}
     */
    getOtherUserCount: function () {
        var count = 0;
        for (var i in this.otherUserAry) {
            if (this.otherUserAry[i]) {
                count++;
            }
        }
        return count;
    },
    /**
     * 清理其他玩家数据
     * @param position
     */
    removeOtherUser: function (position) {
        if (this.otherUserAry[position]) {
            delete this.otherUserAry[position];
            this.otherUserAry[position] = null;
        } else {
            Log.warn('删除其他玩家数据->没有[' + position + ']玩家');
        }
    },
    /**
     * 清理所有的其他玩家数据
     */
    removeAllOtherUser: function () {
        // Log.debug("--------清理其他玩家全部数据--------");
        for (var i in this.otherUserAry) {//< 别人数据
            if (this.otherUserAry[i]) {
                delete this.otherUserAry[i];
                this.otherUserAry[i] = null;
            } else {
                Log.warn('清理所有的其他玩家数据->没有[' + i + ']玩家');
            }
        }
        this.otherUserAry = [];
    },

    /**
     * 重置所有玩家数据([局部数据重置]自己和其他人)
     */
    resetAllUserData: function () {
        this.selfData.reset();
        this.foreachOtherUser(function (userData) {
            userData.reset();
        });
    },

    /**
     * 删除所有玩家对象
     */
    deleteAllObject: function () {
        if (this.roomObj) {
            delete this.roomObj;
        }
        this.roomObj = null;
        this.removeAllOtherUser();
        if (this.selfData) {
            delete this.selfData;
        }
        this.selfData = null;
    },

});

/**
 * 导出函数
 */
module.exports = new UserManager();