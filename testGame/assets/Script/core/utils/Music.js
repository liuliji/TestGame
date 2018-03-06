/************************************************************************
 * Copyright (c) 2017 App
 * Author   : Awaken
 * Mail     : Awaken929@sina.com
 * Date     : 2017-04-16
 * Use      : 游戏本地声音
 ************************************************************************/

/**
 *  范例:
 *      var Music=require('Music');//导入音乐头文件
 *      Music.setMusicPath('resources/music/');//设置音乐默认路径
 *      Music.playMusic('abc.mp3');//播放背景音乐
 *      Music.playSoundEffect('abc.wav');//播放音效
 *      Music.saveMusicSetting () // 保存音乐设置
 *      Music.loadMusicSetting () // 读取音乐设置
 *
 * @constructor
 */
function Music() {
    this._musicId = null;
    this._soundEffect = null;//音效

    this._musicVolume = 0.5;
    this._soundEffectVolume = 0.5;

    this.isPause = false;
    this._resPath = null;//音乐资源路径
}


Music.prototype._musicInit = function () {
    this.intervalID = setInterval(function (td) {
        if (this._soundEffect) {
            for (let i = this._soundEffect.length - 1; i >= 0; i--) {
                if (this._soundEffect[i]) {
                    var id = this._soundEffect[i];
                    var state = cc.audioEngine.getState(id);
                    if (state < 0) {
                        this._soundEffect.splice(i, 1);
                    }
                }
            }
        }
    }.bind(this), 2 * (1000));
    //游戏切入后台
    cc.game.on(cc.game.EVENT_HIDE, function () {
        this.pauseAll();
    }.bind(this));
    //游戏切回来
    cc.game.on(cc.game.EVENT_SHOW, function () {
        this.resumeAll();
    }.bind(this));


    this._resPath=null;
    this.isPause=false;
}

/**
 * 绑定音乐
 * @param {cc.Node} object 绑定的对象
 * @param {String} musicPath 音乐默认路径(背景音乐名字,默认是res/raw-assets/resources/)
 */
Music.prototype.setMusicPath = function (musicPathName) {
    this._musicInit();
    this._resPath = cc.url.raw('' + musicPathName);
    // Log.debug('音乐路径:'+this._resPath);
    this._soundEffect = [];
}

/**
 *  播放音乐文件
 * @param filename 背景音乐文件
 * @param isPlay 加载完是否播放
 */
Music.prototype.playMusic = function (filename, loop = true, volume = this._musicVolume) {
    if (!this.isPause) {
        if(!this._resPath){
            Log.error('音乐默认播放路径==null');
            return;
        }
        // cc.audioEngine.stop(this._musicId);//停止播放指定音频。
        cc.audioEngine.stopAll();//停止全部播放指定音频。
        this._musicId = cc.audioEngine.play(this._resPath + filename, loop, volume);
    }
}
/**
 * 背景音乐暂停
 */
Music.prototype.pauseMusic = function () {
    cc.audioEngine.pause(this._musicId);
}
/**
 * 背景音乐继续播放
 */
Music.prototype.resumeMusic = function () {
    cc.audioEngine.resume(this._musicId);
}
/**
 * 设置背景音乐大小
 * @param volume
 */
Music.prototype.setMusicVolume = function (volume) {
    if (this._musicVolume !== volume) {
        this._musicVolume = volume;
        cc.audioEngine.setVolume(this._musicId, this._musicVolume);
    }
}
/**
 * 获取背景音乐大小
 * @returns {Number}
 */
Music.prototype.getMusicVolume = function () {
    return parseFloat(this._musicVolume);
}

/**
 * 播放音效
 * @param filename 音效文件
 * @param loop 是否循环
 * @param volume 音量大小
 */
Music.prototype.playSoundEffect = function (filename, loop = false, volume = this._soundEffectVolume) {
    if (!this.isPause) {
        if(!this._resPath){
            log.error('音乐默认播放路径==null');
            return;
        }
        var id = cc.audioEngine.play(this._resPath + filename, loop, volume);
        this._soundEffect.push(id);
    }
}

/**
 * 设置音效大小
 * @param volume
 */
Music.prototype.setSoundEffectVolume = function (volume) {
    if (this._soundEffectVolume !== volume) {
        this._soundEffectVolume = volume;
        if (this._soundEffect) {
            for (let i = this._soundEffect.length - 1; i >= 0; i--) {
                if (this._soundEffect[i]) {
                    var id = this._soundEffect[i];
                    cc.audioEngine.setVolume(id, this._soundEffectVolume);
                }
            }
        }
    }
}

/**
 * 获取音效声音大小
 * @returns {Number}
 */
Music.prototype.getSoundEffectVolume = function () {
    return parseFloat(this._soundEffectVolume);
}
/**
 * 暂停全部音乐和音效
 */
Music.prototype.pauseAll = function () {
    this.isPause=true;
    cc.audioEngine.pauseAll();
}
/**
 * 恢复全部音乐和音效
 */
Music.prototype.resumeAll = function () {
    this.isPause=false;
    cc.audioEngine.resumeAll();
}

/**
 * 预加载音效资源
 * @param filePath 资源名字
 * @param callback 回调函数
 */
Music.prototype.preload = function (filePath, callback) {
    if(!this._resPath){
        Log.error('音乐默认播放路径==null');
        return;
    }
    cc.audioEngine.preload(this._resPath+filePath, callback);
}

/**
 * 卸载预加载的音频。
 * @param fileName
 */
Music.prototype.uncache = function (fileName) {
    if(!this._resPath){
        Log.error('音乐默认播放路径==null');
        return;
    }
    cc.audioEngine.uncache(this._resPath+fileName);
}
/**
 * 销毁所以资源
 */
Music.prototype.uncacheAll = function () {
    cc.audioEngine.uncacheAll();
}

const _MUSIC_VOLUME = 'musicVolume';
const _SOUND_VOLUME = 'soundVolume';
/**
 * 保存音乐和音效声音大小
 */
Music.prototype.saveMusicSetting = function () {
    sgm.MethodsUtils.saveLocalData(_MUSIC_VOLUME, this._musicVolume);
    sgm.MethodsUtils.saveLocalData(_SOUND_VOLUME, this._soundEffectVolume);
}
/**
 * 读取音乐和音效声音大小
 */
Music.prototype.loadMusicSetting = function () {
    let musicVolume=sgm.MethodsUtils.loadSavaLocalData(_MUSIC_VOLUME);
    // log.debug("读取音乐和音效声音大小 0  musicVolume:"+musicVolume);
    let musicVolumeType=typeof(musicVolume);
    if(musicVolumeType!=="string"){
        musicVolume=0.5;
    }else{
        musicVolume = parseFloat(musicVolume);
    }
    // log.debug("读取音乐和音效声音大小 2  musicVolume:"+ this._musicVolume);
    let soundVolume=sgm.MethodsUtils.loadSavaLocalData(_SOUND_VOLUME);
    // log.debug("读取音乐和音效声音大小 0  soundVolume:"+soundVolume);
    let soundVolumeType=typeof(soundVolume);
    if(soundVolumeType!=="string"){
        soundVolume=0.5;
    }else{
        soundVolume = parseFloat(soundVolume);
    }
    // log.debug("读取音乐和音效声音大小 2  soundVolume:"+ this._soundEffectVolume);

    if(musicVolumeType!=="string" && soundVolumeType!=="string"){
        // log.debug("第一次保存");
        this.saveMusicSetting();
    }
    this.setMusicVolume(musicVolume);
    this.setSoundEffectVolume(soundVolume);
}

Music.prototype.clear = function () {
    // //游戏切入后台
    // cc.game.off(cc.game.EVENT_HIDE, this.pauseAll(),this);
    // //游戏切回来
    // cc.game.off(cc.game.EVENT_SHOW,this.resumeAll(),this);

    clearInterval(this.intervalID);
}

module.exports = new Music();
