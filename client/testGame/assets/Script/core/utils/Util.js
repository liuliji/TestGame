/**
 * js代码继承
 * @param ctor
 * @param superCtor
 */
function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
}

/**
 * 字符串转Json对象
 *  code 范例
 *      var strObject={'bwUid':10061,'nickName':'135****9262','image':'','sex':0};
 *      var tempString=JSON.stringify(strObject);
 *      var jsbObject=Util.stringToJson(tempString);
 *      console.log('bwUid:'+jsbObject.bwUid);//bwUid:10061
 * @param stringValue
 * @returns {*}
 */
function stringToJson(stringValue) {
    var theJsonValue = null;
    eval("theJsonValue = " + stringValue);
    return theJsonValue;
}
/**
 * 数据类型
 * @type {{NUMBER: string, STRING: string, BOOLEAN: string, UNDEFINED: string, NULL: string, OBJECT: string, ARRAY: string, DATE: string, MATH: string, JSON: string, ERROR: string, REGEXP: string, FUNCTION: string, ARGUMENTS: string}}
 */
var dataType={
    NUMBER:'number',
    STRING:'string',
    BOOLEAN:'boolean',
    UNDEFINED:'undefined',
    NULL:'null',
    OBJECT:'object',
    ARRAY:'array',
    DATE:'date',
    MATH:'math',
    JSON:'json',
    ERROR:'error',
    REGEXP:'regexp',
    FUNCTION:'function',
    ARGUMENTS:'arguments'
}


/**
 * 对象类型
 *   code 范例
 *       var number = 1;           //number
 *       var string = '123';       //string
 *       var iboolean = true;      //boolean
 *       var und = undefined;      //undefined
 *       var nul = null;           //null
 *       var obj = {a: 1}          //object
 *       var array = [1, 2, 3];    //array
 *       var date = new Date();    //date
 *       var math = Math;          //math
 *       var json = JSON;          //json
 *       var error = new Error();  //error
 *       var reg = /a/g;           //regexp
 *       var func = function a(){};//function
 *
 *       console.log('---------开始--------');
 *       function checkType() {
 *           console.log('\tArguments:'+type(arguments)); //arguments
 *           for (var i = 0; i < arguments.length; i++) {
 *               console.log('\t'+arguments[i]+':'+type(arguments[i]));
 *           }
 *       }
 *       checkType(number, string, iboolean, und, nul, obj, array, date,math,json, error, reg, func);
 *       console.log('---------结束--------');
 * @param obj
 * @returns {*}
 */
function type(obj) {
    var class2type = {};
    // 生成class2type映射
    'Boolean Number String Function Array Date Math JSON RegExp Object Error Arguments'.split(' ').map(function (item, index) {
        class2type['[object ' + item + ']'] = item.toLowerCase();//字符串转成小写字母
    })
    if (obj == null) {
        return '' + obj;
    }
    return (typeof obj === 'object' || typeof obj === 'function') ?
        (class2type[Object.prototype.toString.call(obj)] || 'object' ) :
        (typeof obj);
}
/**
 *  判断2个对象是否相等
 *  code 范例
 *       console.log('0,0:',Util.eq(0, 0)) // true
 *       console.log('0,-0:',Util.eq(0, -0)) // false
 *
 *       console.log('NaN,NaN:',Util.eq(NaN, NaN)); // true
 *       console.log('Number(NaN),Number(NaN):',Util.eq(Number(NaN), Number(NaN))); // true
 *
 *       console.log('Culy,new String(Curly):',Util.eq('Curly', new String('Curly'))); // true
 *
 *       console.log('[1],[1]:',Util.eq([1], [1])); // true
 *       console.log('{value:1},{value:1}:',Util.eq({ value: 1 }, { value: 1 })); // true
 *
 *       var a, b;
 *       a = { foo: { b: { foo: { c: { foo: null } } } } };
 *       b = { foo: { b: { foo: { c: { foo: null } } } } };
 *       a.foo.b.foo.c.foo = a;
 *       b.foo.b.foo.c.foo = b;
 *       console.log('Object a,Object b:',Util.eq(a, b)) // true
 *
 * @param a  对象A
 * @param b  对象B
 * @param aStack
 * @param bStack
 * @returns {true/false}
 */
function eq(a, b, aStack, bStack) {
    // === 结果为 true 的区别出 +0 和 -0
    if (a === b) {
        return a !== 0 || 1 / a === 1 / b;
    }
    // typeof null 的结果为 object ，这里做判断，是为了让有 null 的情况尽早退出函数
    if (a == null || b == null) {
        return false;
    }
    // 判断 NaN
    if (a !== a) {
        return b !== b;
    }
    // 判断参数 a 类型，如果是基本类型，在这里可以直接返回 false
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') {
        return false;
    }
    // 更复杂的对象使用 deepEq 函数进行深度比较
    return this.deepEq(a, b, aStack, bStack);
}
/**
 * 复杂对象是否相等
 * @param a
 * @param b
 * @param aStack
 * @param bStack
 * @returns {boolean}
 */
function deepEq(a, b, aStack, bStack) {
    var isFunction = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Function]'
    }

    // a 和 b 的内部属性 [[class]] 相同时 返回 true
    var className = Object.prototype.toString.call(a);
    if (className !== Object.prototype.toString.call(b)) {
        return false;
    }

    switch (className) {
        case '[object RegExp]':
        case '[object String]':
            return '' + a === '' + b;
        case '[object Number]':
            if (+a !== +a) return +b !== +b;
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
            return +a === +b;
    }

    var areArrays = className === '[object Array]';
    // 不是数组
    if (!areArrays) {
        // 过滤掉两个函数的情况
        if (typeof a != 'object' || typeof b != 'object') {
            return false;
        }

        var aCtor = a.constructor,
            bCtor = b.constructor;
        // aCtor 和 bCtor 必须都存在并且都不是 Object 构造函数的情况下，aCtor 不等于 bCtor， 那这两个对象就真的不相等啦
        if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
            return false;
        }
    }


    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;

    // 检查是否有循环引用的部分
    while (length--) {
        if (aStack[length] === a) {
            return bStack[length] === b;
        }
    }

    aStack.push(a);
    bStack.push(b);

    // 数组判断
    if (areArrays) {
        length = a.length;
        if (length !== b.length) return false;
        while (length--) {
            if (!this.eq(a[length], b[length], aStack, bStack)) return false;
        }
    } else { // 对象判断
        var keys = Object.keys(a),
            key;
        length = keys.length;
        if (Object.keys(b).length !== length) return false;
        while (length--) {
            key = keys[length];
            if (!(b.hasOwnProperty(key) && this.eq(a[key], b[key], aStack, bStack))) return false;
        }
    }
    aStack.pop();
    bStack.pop();
    return true;
}
/**
 * 函数记忆
 *  定义:函数记忆是指将上次的计算结果缓存起来，当下次调用时，如果遇到相同的参数，就直接返回缓存中的数据。
 * code 范例1
 *      var count = 0;
 *      var fibonacci = function(n) {
 *               count++;
 *               return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
 *       };
 *      fibonacci =  Util.memorize(fibonacci)
 *      for (var i = 0; i <= 10; i++) {
 *               console.log(fibonacci(i));
 *           }
 *      console.log('运行次数:'+count) // 12
 *   这个例子是用来表明一种使用的场景，也就是如果需要大量重复的计算，
 *   或者大量计算又依赖于之前的结果，便可以考虑使用函数记忆。而这种场景，
 *   当你遇到的时候，你就会知道的。
 *   code 范例2(这个例子就没有必要使用函数记忆了)
 *       var count = 0;
 *        var abc = function(a, b, c) {
 *           count++;
 *           return a + b + c
 *       }
 *        abc =  Util.memorize(abc);
 *        for (var i = 0; i <= 10; i++) {
 *           console.log(abc(i,i+1,i+2)) // 12
 *       }
 *        console.log('运行次数:'+count) // 12
 * @param func 函数体
 * @param hasher
 * @returns {memoize}
 */
function memorize(func, hasher) {
    var memoize = function (key) {//key运行函数的参数
        var cache = memoize.cache;
        var address = '' + (hasher ? hasher.apply(this, arguments) : key);
        if (!cache[address]) {
            cache[address] = func.apply(this, arguments);
        }
        return cache[address];
    };
    memoize.cache = {};
    return memoize;
}

/**
 * 浅拷贝的实现
 * @param obj 拷贝的对象
 * @returns {*}拷贝后的对象
 */
function shallowCopy(obj) {
    // 只拷贝对象
    if (typeof obj !== 'object') return;
    // 根据obj的类型判断是新建一个数组还是对象
    var newObj = obj instanceof Array ? [] : {};
    // 遍历obj，并且判断是obj的属性才拷贝
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}


/**
 * 深拷贝的实现
 * @param obj 拷贝的对象
 * @returns {*}拷贝后的对象
 */
function deepCopy(obj) {
    if (typeof obj !== 'object') return obj;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? this.deepCopy(obj[key]) : obj[key];
        }
    }
    return newObj;
}
/**
 * 获取字符串长度(中英文字母)
 * @param str 字符串
 * @returns {{length: 字符长度, z: 中文, e: 英文}}
 */
function getStringLength(str) {
    if (!str) {
        Log.error('getStringLength 获取字符串长度 字符串为null');
        return;
    }

    var strlen = 0;
    var z = 0;
    var e = 0;
    let count = str.length;
    for (let i = 0; i < count; i++) {
        if (str.charCodeAt(i) > 255) { //如果是汉字，则字符串长度加2
            strlen += 2;
            z++;
        } else {
            strlen++;
            e++;
        }
    }
    var names = {
        length: strlen,//字符长度
        z: z,//中文
        e: e,//英文
    }
    return names;
}
/**
 * 验证手机号码
 * @param phoneNumber 手机号码
 * @returns {boolean} true:成功,false失败
 */
function verificationPhoneNumber(phoneNumber) {
    var mobileReg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
    if (!mobileReg.test(phoneNumber)) {
        return false;
    }
    return true;

    // var re = new RegExp(/^1[3|4|5|7|8][0-9]\d{4,8}$/);
    // let search=phoneNumber.search(re);
    // Log.debug("abc:"+search);
    // if (search!==-1) {
    //
    // } else {
    //
    // }
}

/**
 * 返回系统时间
 * @returns {{n: number, y: number, r: number, x: number, s: number, f: number, m: number, h: number, now: number}}
 */
function sysData() {
    var vDate = new Date();
    var year = (1900 + vDate.getYear());//年
    var month = (vDate.getMonth() + 1);//月
    var date = vDate.getDate();//日
    var day = vDate.getDay() + 1;//星期[0-6]
    var hours = vDate.getHours();//小时
    var minutes = vDate.getMinutes();//分钟0-59
    var seconds = vDate.getSeconds();//秒0-59
    var milliSeconds = vDate.getMilliseconds();//返回毫秒0-999

    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    return {
        n: year,//年
        y: month,//月
        r: date,//日
        x: day,//星期
        s: hours,//小时
        f: minutes,//分钟0-59
        m: seconds,//秒数0-59
        h: milliSeconds,//毫秒0-999
        now: Date.now(),//返回自1970-1-1 00:00:00 UTC(协调世界时)至今所经过的毫秒数。
    }
}

/**
 * 导出函数列表
 */
module.exports = {
    'inherits': inherits, // 继承
    'stringToJson': stringToJson,//字符串转Json对象
    'dataType':dataType,
    'type': type,//对象类型
    'eq': eq,//判断2个对象是否相等
    'deepEq': deepEq,//复杂对象是否相等
    'memorize': memorize,//函数记忆
    'shallowCopy': shallowCopy,//浅拷贝的实现
    'deepCopy': deepCopy,//深拷贝的实现
    'getStringLength': getStringLength,//获取字符串长度(中英文字母)
    'verificationPhoneNumber': verificationPhoneNumber,//验证手机号码
    'sysData': sysData,//返回系统时间
};

