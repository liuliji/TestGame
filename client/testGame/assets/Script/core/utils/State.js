/************************************************************************
 * Copyright (c) 2017 App
 * Author   : Awaken
 * Mail     : Awaken929@sina.com
 * Date     : 2017-04-15
 * Use      : 游戏本地状态机
 ************************************************************************/

/**
 * 状态类
 *
 *  伪代码
 *      //导入头文件
 *      var State=require('State');
 *      //创建对象
 *      this.stateA=new State();
 *      //绑定对象执行函数
 *      this.stateA.setStateBindFunction('当前状态',当前状态执行的函数,当前状态销毁执行函数);
 *      //切换状态
 *      this.stateA.setState('当前状态',state当前状态参数,lastState当前或上一次函数的参数);
 *
 *    code
 *        var State=require('State');
 *        this.state=new State();
 *        this.state.setStateBindFunction(0,
 *              function(){//当前状态回调函数
 *                       let array=arguments;//获取参数数组
 *                       if(array){
 *                           let str='';
 *                           for(let i=0,count=array.length;i<count;i++){
 *                               str+=array[i];
 *                           }
 *                           console.log(str);
 *                       }
 *               }.bind(this),
 *              function () {//当前状态弹出回调函数
 *                       let array=arguments;
 *                       if(array){
 *                           let str='';
 *                           for(let i=0,count=array.length;i<count;i++){
 *                               str+=array[i];
 *                           }
 *                           console.log(str);
 *                       }
 *              }.bind(this)
 *        );
 *        //执行函数
 *        this.state.setState(0,State.STATE_ARGUMENT,'A',1,2,3,State.LAST_STATE_ARGUMENT,'AA',3,2,1);
 *
 *        //清理数据
 *        this.state.clear();
 *        delete this.state;
 *        this.state=null;
 */
function State() {
    this._state = {//状态
        state: null,//当前状态
        lastState: null,//上一次状态
        stateBindObject: null,//当前状态绑定的对象
    }

    this._arguments = { //状态参数参数
        stateArgument: null,
        lastStateArgument: null,
    }
    //状态消息队列
    this._messageStack = {
        messageList: [],
    }
    this.debugLog = false;
    this._stateArgumentType = 1;//0当前状态参数和上一个状态参数， 1当前状态参数和当前弹出参数
    this._isCFRun=false;
}
/**
 *  设置状态对象
 * @method setStateObject
 * @param stateObject
 */
State.prototype.setStateObject = function (stateObject) {
    this._state = stateObject;
}
/**
 *  设置状态参数类型
 * @method setStateArgumentType
 * @param stateArgumentType 默认(1)是当前状态参数 和 当前状态弹出参数
 */
State.prototype.setStateArgumentType = function (stateArgumentType) {
    this._stateArgumentType = stateArgumentType;
}

/**
 * 设置状态(只设置状态,不执行回调函数)
 * @method setState
 * @param state 状态
 */
State.prototype.setState = function (state) {
    if (this.debugLog) {
        console.log('---------------------------' + state + '---------------------------');
    }
    // this._isCFRun=isRun;
    // if(this._isCFRun){
    //         this._state.lastState = this._state.state;
    //         this._state.state = state;
    //         this.setStateArguments(arguments);
    //         this.runStateBindObject(this._state.state, this._state.lastState);
    //         if (this.debugLog) {
    //             console.log('---------------------------' + state + '---------------------------');
    //         }
    // }else{
    //     if (state !== this._state.state) {
    //         this._state.lastState = this._state.state;
    //         this._state.state = state;
    //
    //         this.setStateArguments(arguments);
    //
    //         this.runStateBindObject(this._state.state, this._state.lastState);
    //         if (this.debugLog) {
    //             console.log('---------------------------' + state + '---------------------------');
    //         }
    //     }
    // }
    this._state.lastState = this._state.state;
    this._state.state = state;
}

/**
 *  设置状态并且执行绑定函数---[绑定函数不限次数执行]
 * @param state 切换的状态
 *  'state',0,1,2,3 当前state状态参数   一般用这个值
 *  'lastState',0,1,2,3 当前state弹出参数(这个值用的少)
 */
State.prototype.setStateRunFunction = function (state) {
    this._state.lastState = this._state.state;
    this._state.state = state;
    this.setStateArguments(arguments);
    this.runStateBindObject(this._state.state, this._state.lastState);
}

/**
 *  设置状态并且执行绑定函数---[绑定函数指执行一次]
 * @param state 切换的状态
 *  'state',0,1,2,3 当前state状态参数   一般用这个值
 *  'lastState',0,1,2,3 当前state弹出参数(这个值用的少)
 */
State.prototype.setStateRunOneFunction = function (state) {
    if (state !== this._state.state) {
        this._state.lastState = this._state.state;
        this._state.state = state;
        this.setStateArguments(arguments);
        this.runStateBindObject(this._state.state, this._state.lastState);
    }
}

/**
 * 获取当前状态
 * @method getState
 * @returns {state}
 */
State.prototype.getState = function () {
    return this._state.state;
}
/**
 * 获取当前状态
 * @method getLastState
 * @returns {lastState}
 */
State.prototype.getLastState = function () {
    return this._state.lastState;
}
/**
 * 获取上一个状态的key
 * @method getStateKey
 * @returns {stateKey}
 */
State.prototype.getStateKey = function () {
    return this.modifyKey(this._state.state);
}

/**
 *  获取上一个状态的key
 * @method getLastStateKey
 * @returns {lastStateKey}
 */
State.prototype.getLastStateKey = function () {
    return this.modifyKey(this._state.lastState);
}

/**
 * @method setStateBindFunction
 * @param state 绑定的状态(key) ,
 * @param stateMenthod  当前状态执行的函数(state(key)->value->key)
 * @param lastMenthod  当前状态销毁执行函数(state(key)->value->key)
 */
State.prototype.setStateBindFunction = function (state, stateMenthod = undefined, lastMenthod = undefined) {
    let menthod = {
        'stateMenthod': stateMenthod,
        'lastMenthod': lastMenthod,
    }
    if (this._state.stateBindObject == null) {
        this._state.stateBindObject = new Map();
    }
    let stateKey = this.modifyKey(state);
    let value = this._state.stateBindObject.get(stateKey);
    if (!value) {
        this._state.stateBindObject.set(stateKey, menthod);
    }
}
/**
 * 执行状态函数
 * @method runStateBindObject
 * @param stateKey 当前状态(key)
 * @param lastStateKey 上一个状态(key)
 */
State.prototype.runStateBindObject = function (stateKey, lastStateKey) {
    if (this.debugLog) {
        console.log('--执行状态函数-->' + '当前状态:' + stateKey + '\t上一个状态:' + lastStateKey);
    }
    if (!this._state.stateBindObject) {
        return;
    }

    let statekey = this.modifyKey(stateKey);
    var stateObject = this._state.stateBindObject.get(statekey);
    if (stateObject) {
        if (stateObject.stateMenthod !== undefined) {
            if (this._arguments.stateArgument[statekey]) {
                if(true){
                    var args = [];
                    var len = this._arguments.stateArgument[statekey].length;
                    for(var i = 0; i < len; i++) {
                        args.push('this._arguments.stateArgument['+statekey+']['+i+']');
                    }
                    eval('stateObject.stateMenthod(' + args +')');
                    // this._arguments.stateArgument.splice(statekey,1);
                    // let a=1;
                    // let b=2;
                }else{
                    stateObject.stateMenthod(this._arguments.stateArgument[statekey]);
                }
            } else {
                stateObject.stateMenthod();
            }
        }
    }
    let laststatekey = this.modifyKey(lastStateKey);
    var lastStateObject = this._state.stateBindObject.get(laststatekey);
    if (lastStateObject) {
        if (lastStateObject.lastMenthod !== undefined) {
            if (this._arguments.lastStateArgument[laststatekey]) {
                if(true){
                    var args = [];
                    var len = this._arguments.lastStateArgument[laststatekey].length;
                    for(var i = 0; i < len; i++) {
                        args.push('this._arguments.lastStateArgument['+laststatekey+']['+i+']');
                    }
                    eval('lastStateObject.lastMenthod(' + args +')');
                    // this._arguments.lastStateArgument.splice(laststatekey,1);
                    // let b=2;
                }else {
                    lastStateObject.lastMenthod(this._arguments.lastStateArgument[laststatekey]);
                }
            } else {
                lastStateObject.lastMenthod();
            }
        }
    }
}

/**
 * 入栈
 * @method pushStack
 * @param key 执行的函数名字(函数名字)
 * @param args 参数
 */
State.prototype.pushStack = function (key, args) {
    var msg = {
        "key": key,
        "args": args
    }
    console.log('添加队列方法:'+msg.key);
    this._messageStack.messageList.push(msg)
}
/**
 * 弹出所以站内消息
 * @method popAllStack
 * @param object 谁执行谁调用
 */
State.prototype.popAllStack = function (object) {
    let count=this._messageStack.messageList.length;
    for (var i = 0; i < count; i++) {
        var msg = this._messageStack.messageList[i];
        if(object) {
            console.log('执行队列方法:'+msg.key);
            object[msg.key](msg.args);
        }
    }
    this._messageStack.messageList = [];
}

/**
 * 获取队列数据
 * @returns {Array}
 */
State.prototype.getStackData = function () {
    return this._messageStack.messageList;
}

State.prototype.clearStack = function () {
    this._messageStack.messageList = [];
}
/**
 * 修改key为字符串
 * @method modifyKey
 * @param key
 * @returns {*}
 */
State.prototype.modifyKey = function (key) {
    let textKey = key;
    if (typeof (textKey) !== 'string') {
        textKey = '' + textKey;
    }
    return textKey;
}

/**
 * 获取参数数组
 *  let array=this._gameState.getArguments(arguments);//获取参数数组
 *     if(array){
 *         let str='';
 *         for(let i=0,count=array.length;i<count;i++){
 *              str+=array[i];
 *         }
 *       console.log("参数:"+str);
 *     }
 * @param valueArgument 参数
 * @returns {Array|null}
 */
State.prototype.getArguments = function (valueArgument) {
    if (!valueArgument) {
        return null;
    }
    let argumentCount = valueArgument.length;
    if (argumentCount == 0) {
        return null;
    }
    for (let i = 0; i < argumentCount; i++) {
        if (valueArgument[i]) {
            return valueArgument[i];
        }
    }
    return null;
}

/**
 * 数据浅拷贝--不支持对象
 * @param obj
 * @returns {*}
 */
State.prototype.shallowCopy = function(obj) {
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
 * 数据深拷贝--不支持对象
 * @param obj
 * @returns {*}
 */
State.prototype.deepCopy = function(obj) {
    if (typeof obj !== 'object') return;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = (typeof obj[key] === 'object') ? (this.deepCopy(obj[key])) :(obj[key]);
        }
    }
    return newObj;
}


/**
 * 设置状态参数
 * @param valueArgument  'state'当前状态参数，'lastState'当前状态弹出参数
 */
State.prototype.setStateArguments = function (valueArgument) {//参数修整
    if (!this._arguments.stateArgument) {
        this._arguments.stateArgument = new Array();
    }
    if (!this._arguments.lastStateArgument) {
        this._arguments.lastStateArgument = new Array();
    }
    let bState = false;
    let iState = 0;
    let bLastState = false;
    let iLastState = 0;
    let newTempIndex = '';


    for (let i = 0, argumentCount = valueArgument.length; i < argumentCount; i++) {
        if (valueArgument[i] == State.STATE_ARGUMENT) {
            bState = true;
            bLastState = false;
            iState = 0;
            iLastState = 0;
            continue;
        } else if (valueArgument[i] == State.LAST_STATE_ARGUMENT) {
            bLastState = true;
            bState = false;
            iLastState = 0;
            iState = 0;
            continue;
        }
        if (bState) {
            newTempIndex = this.modifyKey(this._state.state);
            if (iState == 0) {
                if (!this._arguments.stateArgument[newTempIndex]) {
                    // console.log("---------State 创建-------");
                    this._arguments.stateArgument[newTempIndex] = new Array();
                } else {
                    delete this._arguments.stateArgument[newTempIndex];
                    // console.log("---------State 删除创建-------");
                    this._arguments.stateArgument[newTempIndex] = new Array();
                }
            }
            this._arguments.stateArgument[newTempIndex][iState] = valueArgument[i]
            iState++;
        } else if (bLastState) {
            if (this._stateArgumentType == 1) {
                newTempIndex = this.modifyKey(this._state.state);
                if (iLastState == 0) {
                    if (!this._arguments.lastStateArgument[newTempIndex]) {
                        // console.log("---------上一个State 创建-------");
                        this._arguments.lastStateArgument[newTempIndex] = new Array();
                    } else {
                        delete this._arguments.lastStateArgument[newTempIndex];
                        // console.log("---------上一个State 删除创建-------");
                        this._arguments.lastStateArgument[newTempIndex] = new Array();
                    }
                }
                this._arguments.lastStateArgument[newTempIndex][iLastState] = valueArgument[i]
                iLastState++;
            } else {
                if (this._state.lastState !== null) {
                    newTempIndex = this.modifyKey(this._state.lastState);
                    if (iLastState == 0) {
                        if (!this._arguments.lastStateArgument[newTempIndex]) {
                            // console.log("---------上一个State 创建-------");
                            this._arguments.lastStateArgument[newTempIndex] = new Array();
                        } else {
                            delete this._arguments.lastStateArgument[newTempIndex];
                            // console.log("---------上一个State 删除创建-------");
                            this._arguments.lastStateArgument[newTempIndex] = new Array();
                        }
                    }
                    this._arguments.lastStateArgument[newTempIndex][iLastState] = valueArgument[i];
                    iLastState++;
                }
            }
        }

    }

    if (this.debugLog) {
        console.log('-------------state--------------');
        for (let i  in this._arguments.stateArgument) {
            newTempIndex = this.modifyKey(this._state.state);
            if (this._arguments.stateArgument[newTempIndex]) {
                for (let ii = 0; ii < this._arguments.stateArgument[newTempIndex].length; ii++) {
                    console.log('\t\tkey:' + ii + '\tvalue:' + this._arguments.stateArgument[newTempIndex][ii]);
                }
                break;
            }
        }
        console.log('-------------state--------------');
        console.log('-------------lastState--------------');
        for (let i  in this._arguments.lastStateArgument) {
            newTempIndex = this.modifyKey(this._state.lastState);
            if (this._arguments.lastStateArgument[newTempIndex]) {
                for (let ii = 0; ii < this._arguments.lastStateArgument[newTempIndex].length; ii++) {
                    console.log('\t\tkey:' + ii + '\tvalue:' + this._arguments.lastStateArgument[newTempIndex][ii]);
                }
                break;
            }
        }
        console.log('-------------lastState--------------');
    }
}


/**
 * 清理数据
 * @method clear
 */
State.prototype.clear = function () {
    //清理当前状态所有参数
    if (this._arguments.stateArgument) {
        for (let i in this._arguments.stateArgument) {
            if (this._arguments.stateArgument[i]) {
                delete this._arguments.stateArgument[i];
            }
        }
        delete this._arguments.stateArgument;
        this._arguments.stateArgument = null;
    }
    //清理当前状态弹出所有参数
    if (this._arguments.lastStateArgument) {
        for (let i in this._arguments.lastStateArgument) {
            if (this._arguments.lastStateArgument[i]) {
                delete this._arguments.lastStateArgument[i];
            }
        }
        delete this._arguments.lastStateArgument;
        this._arguments.lastStateArgument = null;
    }
    //清理绑定对象
    if (this._state.stateBindObject) {
        this._state.stateBindObject.clear();
        delete this._state.stateBindObject;
        this._state.stateBindObject = null;
    }
    this.clearStack();
    //当前状态
    this._state.state = null;
    //上一次状态
    this._state.lastState = null;
}

//设置状态参数前缀
State.STATE_ARGUMENT='state';
State.LAST_STATE_ARGUMENT='lastState';

module.exports = State;
