var fs = require('fs');
stat = fs.stat;
var path = require('path');
var crypto = require('crypto');

var url = 'http://192.168.31.80:8080/update/'
var game = 'game1';

var manifest = {
    packageUrl: 'http://localhost/tutorial-hot-update/remote-assets/',
    remoteManifestUrl: 'http://localhost/tutorial-hot-update/remote-assets/project.manifest',
    remoteVersionUrl: 'http://localhost/tutorial-hot-update/remote-assets/version.manifest',
    version: '1.0.0',
    assets: {},
    searchPaths: []
};

var dest = './remote-assets/';
// var src = './jsb/';
var src = 'build/jsb-default/';

// Parse arguments
var i = 2;
while (i < process.argv.length) {
    var arg = process.argv[i];

    switch (arg) {
        // case '--url':
        // case '-u':
        //     var url = process.argv[i + 1];
        //     manifest.packageUrl = url;
        //     manifest.remoteManifestUrl = url + 'project.manifest';
        //     manifest.remoteVersionUrl = url + 'version.manifest';
        //     i += 2;
        //     break;
        case '--version':
        case '-v':
            manifest.version = process.argv[i + 1];

            // 热更新资源的路径，例如 http://192.168.31.80:8080/game1/1_0_1/
            var version = '' + process.argv[i + 1];
            var v = version.replace(/\./g, '_');
            // console.log('version为 ' + v);
            manifest.packageUrl = url + game + '/' + v + '/remote-assets' + '/';
            manifest.remoteManifestUrl = url + game + '/' + v + '/remote-assets' + '/' + 'project.manifest';
            manifest.remoteVersionUrl = url + game + '/' + v + '/remote-assets' + '/' + 'version.manifest';
            // 本地原生打包版本的目录相对路径
            // src = src + game + '/';

            // console.log('资源服务器地址资源目录位置 ' + manifest.packageUrl);
            // console.log('资源服务器地址project文件位置 ' + manifest.remoteManifestUrl);
            // console.log('资源服务器地址version文件位置 ' + manifest.remoteVersionUrl);
            console.log('\n\n\n将remote-assets上传到远程目录  \n' + url + game + '/' + v + '\n\n\n');
            i += 2;
            break;
        // case '--src':
        // case '-s':
        //     src = process.argv[i + 1];
        //     i += 2;
        //     break;
        // case '--dest':
        // case '-d':
        //     dest = process.argv[i + 1];
        //     i += 2;
        //     break;
        default:
            i++;
            break;
    }
}


function readDir(dir, obj) {
    var stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    }
    var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
    for (var i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = path.join(dir, subpaths[i]);
        stat = fs.statSync(subpath);
        if (stat.isDirectory()) {
            readDir(subpath, obj);
        }
        else if (stat.isFile()) {
            // Size in Bytes
            size = stat['size'];
            md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'binary')).digest('hex');
            compressed = path.extname(subpath).toLowerCase() === '.zip';

            relative = path.relative(src, subpath);
            relative = relative.replace(/\\/g, '/');
            relative = encodeURI(relative);
            obj[relative] = {
                'size': size,
                'md5': md5
            };
            if (compressed) {
                obj[relative].compressed = true;
            }
        }
    }
}

var mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    } catch (e) {
        if (e.code != 'EEXIST') throw e;
    }
}

/***********************************复制文件函数开始*****************************************/
// 删除目录
function deleteFolder(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
// 复制函数
var copy = function (src, dst) {
    // 读取目录中的所有文件/目录
    fs.readdir(src, function (err, paths) {
        if (err) {
            throw err;
        }

        paths.forEach(function (path) {
            var _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;

            stat(_src, function (err, st) {
                if (err) {
                    throw err;
                }

                // 判断是否为文件
                if (st.isFile()) {
                    // 创建读取流
                    readable = fs.createReadStream(_src);
                    // 创建写入流
                    writable = fs.createWriteStream(_dst);
                    // 通过管道来传输流
                    readable.pipe(writable);
                }
                // 如果是目录则递归调用自身
                else if (st.isDirectory()) {
                    exists(_src, _dst, copy);
                }
            });
        });
    });
};
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function (src, dst, callback) {
    fs.exists(dst, function (exists) {
        // 已存在
        if (exists) {
            callback(src, dst);
        }
        // 不存在
        else {
            fs.mkdir(dst, function () {
                callback(src, dst);
            });
        }
    });
};
/***********************************复制文件函数结束*****************************************/

// Iterate res and src folder
readDir(path.join(src, 'src'), manifest.assets);
readDir(path.join(src, 'res'), manifest.assets);

var destManifest = path.join(dest, 'project.manifest');
var destVersion = path.join(dest, 'version.manifest');

mkdirSync(dest);

fs.writeFile(destManifest, JSON.stringify(manifest), (err) => {
    if (err) throw err;
    // console.log('Manifest successfully generated');
});

delete manifest.assets;
delete manifest.searchPaths;
fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
    if (err) throw err;
    // console.log('Version successfully generated');
});

// 复制目录，只需要复制src和res目录
exists(src + 'src', dest + 'src', copy);
exists(src + 'res', dest + 'res', copy);
