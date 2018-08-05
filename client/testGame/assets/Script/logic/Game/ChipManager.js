var BaseClass = require('BaseClass');

var ChipManager = cc.Class({
    extends: BaseClass,

    properties: {
        chipArray: [], // 筹码
        chipPrefab: cc.Prefab, // 筹码的prefab
        seed: 0,// 随机种子
    },

    ctor: function () {
        this.chipPool = new cc.NodePool();
    },

    // 将某个筹码push到数组中
    push: function (chip) {
        this.chipArray.push(chip);
    },

    // 将game中的prefab传递给改对象
    setPrefab: function (chipPrefab) {
        this.chipPrefab = chipPrefab;
    },

    // 初始化随机种子
    initSeed: function (seed) {
        this.seed = seed;
    },

    /**
     * 根据最大值和最小值，获取伪随机数
     */
    seededRandom: function (min, max) {
        max = max || 1;
        min = min || 0;
        this.seed = (this.seed * 9301 + 49297) % 233280;
        var rnd = this.seed / 233280.0;
        return min + rnd * (max - min);
    },

    // 创建筹码
    createChip: function (value) {
        let chipNode = null;
        if (this.chipPool.size() > 0) {
            chipNode = this.chipPool.get();
        } else {
            chipNode = cc.instantiate(this.chipPrefab);
        }
        var chip = chipNode.getComponent('Chip');
        if (chip) {
            chip.setValue(value);
        }
        this.chipArray.push(chip);
        return chipNode;
    },


    // 直接在某个位置创建筹码
    createChipWithPosition(value, p = new cc.Vec2(0, 0)) {
        var chipNode = this.createChip();
        chipNode.stopAllActions();
        chip.setPosition(p);
        return chipNode;
    },

    // 
    foreach: function (func) {
        if (func) {
            for (var key in this.chipArray) {
                func(this.chipArray[key]);
            }
        }
    },

    // 移除某个球球
    removeChip: function (chip) {
        for (var i = 0; i < this.chipArray.length; i++) {
            var tmpChip = this.chipArray[i];
            if (tmpChip == chip) {
                this.chipArray.splice(i, 1);
                // 球球停止所有的动画
                tmpChip.node.stopAllActions();
                // 将筹码重新放回到对象池中
                this.chipPool.put(tmpChip.node);
                return;
            }
        }
    },

    clean: function () {
        for (var i = 0; i < this.chipArray.length; i++) {
            var chip = this.chipArray[i];
            this.chipPool.put(chip.node);
        }
        this.chipArray = [];
    }


});