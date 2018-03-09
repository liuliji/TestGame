var HttpScript = require('HttpScript');
cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
        
    },
    // 测试http
    testHttp: function(){
        var url = 'https://api.weixin.qq.com/sns/userinfo';
        var msg = {
            access_token: 'QVh_MsM9SxBOAlWsHEGXbkxRAxeM6BJYDQ7bI7k3BuZyK6TiBDZuHuYGoz2lD6lXSHCktkiODtpGaymmEDGxk4wriUTq0j5IObAOuoLFSRg',
            openid: 'oPLJ80yxqJqDPRjo04y8WfqOFtlE',
        }
        HttpScript.getInstance().getRequest(url,msg,function(args){
            debugger;
        });
    },

    // called every frame
    update: function (dt) {

    },
});
