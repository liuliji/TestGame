var BaseClass = require('BaseClass');

var ChipManager = cc.Class({
    extends: BaseClass,

    properties: {
        ballArray: [], // 筹码
        chipPrefab: cc.Prefab, // 筹码的prefab
    },

    ctor: function () {
        this.chipPool = new cc.NodePool();
    },

    // 将某个筹码push到数组中
    push: function (ball) {
        this.ballArray.push(ball);
    },

    // 将game中的prefab传递给改对象
    setPrefab: function (chipPrefab) {
        this.chipPrefab = chipPrefab;
    },

    // 创建球球
    createBall: function () {
        let ballNode = null;
        if (this.chipPool.size() > 0) {
            ballNode = this.chipPool.get();
        } else {
            ballNode = cc.instantiate(this.chipPrefab);
        }
        var ball = ballNode.getComponent('Chip');
        this.ballArray.push(ball);
        return ballNode;
    },

    // 
    foreach: function (func) {
        if (func) {
            for (var key in this.ballArray) {
                func(this.ballArray[key]);
            }
        }
    },

    // 移除某个球球
    removeBall: function (ball) {
        for (var i = 0; i < this.ballArray.length; i++) {
            var tmpBall = this.ballArray[i];
            if (tmpBall == ball) {
                this.ballArray.splice(i, 1);
                // 球球停止所有的动画
                tmpBall.node.stopAllActions();
                // 将筹码重新放回到对象池中
                this.chipPool.put(tmpBall.node);
                return;
            }
        }
    },

    clean: function () {
        for (var i = 0; i < this.ballArray.length; i++) {
            var ball = this.ballArray[i];
            this.chipPool.put(ball.node);
        }
        this.ballArray = [];
    }


});