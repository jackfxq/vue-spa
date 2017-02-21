/**
 * Created by jack on 17/2/21.
 */
var exec = require('child_process').exec;
var chokidar = require('chokidar');
chokidar.watch('./dist').on('change', function(path){
    'use strict';
    console.log(new Date() + path + '文件变化了...');
    exec('cd dist;cp -r index.html static ../../vue-blog',function(err, out, code) {
        console.log(new Date() + ':完成...');
    });
});