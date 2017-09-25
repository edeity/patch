/**
 * Created by edeity on 16/9/3.
 * 便于对本地补丁文件的操作, 该类仅读取数据库的内容, 而不对数据库进行写操作
 */

var Category = require('../db/category').Category;
var Patch = require('../db/patch').Patch;
var fs = require('fs');
var crypto = require('crypto');

class PatchFile {
    /**
     * 改变补丁连接中的文件位置(物理位置)
     * @param patchId
     * @param newCategoryId
     */
    static moveFilePath(patchId, newCategoryId, callback) {
        Patch.findOne({_id: patchId}, (err, doc) => {
            var path = this.checkPathExit(newCategoryId);
            var preLink = 'public/' + doc.link;
            var newPath = path + doc.title;
            var realPath =  this.renameFile(preLink, newPath);
            realPath = realPath.split('/');
            realPath.shift(); // 取出public
            realPath = realPath.join('/');
            callback && callback(realPath);
        })
    }
    /**
     * 根据patchId获取旧文件路径, 并且删除该路径;
     * @param patchId
     */
    static deleteOldPatchFile(patchId) {
        Patch.findOne({_id: patchId}, function (err, doc) {
            // 删除旧文件
            if (typeof link !== 'undefined' && doc.link.trim() !== '') {
                // 假如之前存在文件路径
                var preLink = doc.link;
                var prePath = 'public' + preLink;
                fs.exists(prePath, function (exists) {
                    if (exists && fs.statSync(prePath).isFile()) {
                        console.log('删除原来的补丁 : ' + prePath);
                        fs.unlinkSync(prePath);
                    }
                })
            }
        });
    }

    /**
     * 根据categoryId 和时间判断是否存在该路径, 若没有, 则创建
     * @param categoryId
     * @returns {string} path 最终生成的路径
     */
    static checkPathExit(categoryId) {
        // 检查路径是否存在, 未来可以使用递归创建
        var path = 'public/files/';
        try {
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
            path += categoryId + '/';
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
                var copyPath = path;
                // 异步: 创建提示符
                Category.findOne({_id: categoryId}, function (err, doc) {
                    // 构造文件提示
                    var categoryTips = copyPath + doc.categoryName;
                    fs.mkdirSync(categoryTips); // 因为文件夹是以id存在, 所以为了比较好辨认, 同时创建目录名
                })
            }
            var date = new Date();
            path += date.getFullYear() + "-" + (date.getMonth() + 1) + '/';
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path)
            }
        } catch (e) {
            throw e;
        }
        return path;
    }

    /**
     * 更改文件名时, 保证文件名唯一的方法
     * @param prePath 之前的路径
     * @param newPath 新的路径
     * @returns {sting} 真正存在在系统中的文件路径
     */
    static renameFile(prePath ,newPath) {
        if(!fs.existsSync(newPath)) {
            fs.renameSync(prePath, newPath);
            return newPath;
        } else {
            console.log('已存在该文件' + newPath);
            var expectPath;
            do{
                expectPath = newPath.split('.'); // 和.zip分割开
                expectPath[0] += Math.round(Math.random()*10); //随机生成文件标示, 每当重复时, 往后添加一位随机数字
                expectPath = expectPath.join('.');
            } while(fs.existsSync(expectPath))
            fs.renameSync(prePath, expectPath);
            return expectPath;
        }
    }

    /**
     *
     * @param path
     * @param successCall
     * @param failureCall
     * @constructor
     */
    static MD5Test(path, successCall, failureCall) {
        // md5唯一校验
        var rs = fs.createReadStream(path);
        var hash = crypto.createHash('md5');
        rs.on('data', hash.update.bind(hash));
        rs.on('end', function () {
            var md5 = hash.digest('hex');
            // md5校验, 假如在patch表中已经包含该md5文件, 证明已经存在该文件, 不需分析处理
            Patch.findOne({md5: md5}, function (err, doc) {
                if(doc && doc.md5) {
                    fs.unlinkSync(path);// 删除暂存文件
                    failureCall && failureCall(md5);
                } else {
                    successCall && successCall(md5);
                }
            })
        })
    }
}

module.exports = PatchFile;