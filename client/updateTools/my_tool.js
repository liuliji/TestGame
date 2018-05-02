// var util = require('./util');
var exec = require('child_process').exec;
var fs = require('fs');
var version_generator = require('./version_generator');
// var config = require('./config');

// 版本号
var version = '';
var i = 2;

while (i < process.argv.length) {
    var arg = process.argv[i];

    switch (arg) {
        case '--version':
        case '-v':
            version = process.argv[i + 1];
            i += 2;
            break;
        default:
            i++;
            break;
    }
}

if (version == '' || version == undefined){
	throw "请输入版本号   例:node my_tool.js -v 1.0.0";
}