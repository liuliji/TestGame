/************************************************************************
 * Copyright (c) 2016 App
 * Author      : Shao
 * Mail        : yi-shaoye@163.com
 * Date        : 2016-11-26
 * Use         : 游戏配置
 ************************************************************************/
var GlobalConfig = {
    'GameName': '科乐斗地主',
    'IsDebug': true,
    'Version': '1.0.0',//当前游戏版本

    'AppIndex':0, //游戏索引(用于账号验证 斗地主3,刨幺6)
    'GameIndex':0,//链接服务器索引
    'GameAppItemId':null,//序号

    'LocalServer': {
        // 'account': 'http://platform-login.kelehd.com:32012', //外网正式
        // 'replay':'http://replayddz.kelehd.com:32011',//正式服-回放地址

        'account': 'http://klhd-cs-333.chinacloudapp.cn:10001', //外网测试服
        'replay': 'http://klhd-cs-222.chinacloudapp.cn:11111',//测试服-回放地址


        // 'account': 'http://klhd-cs-333.chinacloudapp.cn:10003', //丽双
        // 'account': 'http://192.168.1.68:62200', //新龙
    },
    'StatisticsServer': "http://stat.kelehd.com:9000/api/action-stat", //统计服务器
    'IpServer': "http://ip.kelehd.com:8080/ip",
    'HomeIp': "http://website.yukewangluo.com",
    'FeedbackIp': 'http://kele.kelehd.com:8686/infeedback',//正式服地址
    //'SceneLogIp': 'http://scene-log.kelehd.com:9090/addlog',//正式服-场景日志地址
    'SceneLogIp': 'http://klhd-cs-005.chinacloudapp.cn:9090/addlog',//测试服-场景日志地址

};
module.exports = GlobalConfig;