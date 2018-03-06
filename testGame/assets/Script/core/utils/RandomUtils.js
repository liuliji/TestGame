/************************************************************************
 * Copyright (c) 2016 App
 * Author    : Shao
 * Mail      : yi-shaoye@163.com
 * Date      : 2016-11-26
 * Use      : 随机数
 ************************************************************************/
var BaseClass = require('BaseClass');

module.exports = cc.Class({
    extends: BaseClass,
    properties: {
        // 随机种子
        randomSeed: [],
        // 最大精度
        seedMax: 10000
    },
    /**
     * 初始化随机种子
     */
    initRandomSeed: function () {
        for (var i = 0; i < this.seedMax; ++i) {
            this.randomSeed.push(i);
        }
        for (var i = 0; i < this.seedMax; ++i) {
            var random = Math.floor(Math.random() * this.seedMax);
            var t = this.randomSeed[random];
            this.randomSeed[random] = this.randomSeed[i];
            this.randomSeed[i] = t;
        }
    },
    /**
     * 获取一个区间的随机数
     * @param from 最小值
     * @param end 最大值
     * @returns {number}
     */
    limit: function (from, end) {
        if (from != Math.min(from, end)) {
            var min = end;
            end = from;
            from = min;
        }
        var range = end - from;
        var random = Math.floor(Math.random() * this.seedMax);
        var t = this.randomSeed[random];
        this.randomSeed[random] = this.randomSeed[0];
        this.randomSeed[0] = t;
        return from + this.randomSeed[0] / this.seedMax * range;
    },

    /**
     * 获取一个区间的随机数(整数)
     * @param from 最小值
     * @param end 最大值
     * @returns {number}
     */
    limitInteger: function (from, end) {
        return Math.round(this.limit(from, end));
    },

    /**
     * 在一个数组中随机获取一个元素
     * @param arr 数组
     * @returns {any} 随机出来的结果
     */
    randomArray: function (arr) {
        var index = Math.floor(Math.random() * arr.length);
        return arr[index];
    },

    /**
     * 种子随机数，每次传进来相同的种子，产生相同的随机数，
     * 返回min~max之间的整数
     * @param seed 随机种子
     * @param max 最大值
     * @param min 最小值
     * @returns  {{value: number(随机数), seed: number(随机种子)}} 返回min~max之间的整数
     */
    getSameRandomWithSeed_Max_Min: function (seed, max, min) {
        max = max || 1;
        min = min || 0;
        seed = (seed * 9301 + 49297) % 233280;
        var rnd = seed / 233280.0;
        var iTemp = min + rnd * (max - min);

        var value = Math.floor(iTemp);

        return {value: value, seed: seed}
    }


});
