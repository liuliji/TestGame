/************************************************************************
 * Copyright (c) 2016 App
 * Author	: Shao
 * Mail		: yi-shaoye@163.com
 * Date		: 2016-11-26
 * Use      : 基础类
 ************************************************************************/

module.exports = cc.Class({
  statics: {
    /**
     * 获取一个单例
     * @returns {any}
     */
    getInstance: function () {
      var args = arguments;
      var Class = this;
      if (!Class._instance) {
        var argsLen = args.length;
        if (argsLen == 0) {
          Class._instance = new Class();
        } else if (argsLen == 1) {
          Class._instance = new Class(args[0]);
        } else if (argsLen == 2) {
          Class._instance = new Class(args[0], args[1]);
        } else if (argsLen == 3) {
          Class._instance = new Class(args[0], args[1], args[2]);
        } else if (argsLen == 4) {
          Class._instance = new Class(args[0], args[1], args[2], args[3]);
        } else if (argsLen == 5) {
          Class._instance = new Class(args[0], args[1], args[2], args[3], args[4]);
        }
      }
      return Class._instance;
    },
  }

});
