/**
 * Created by edeity on 16/8/10.
 */
var express = require('express');
var router = express.Router();
// 上传文件插件
var multiparty = require('multiparty');
var fs = require('fs');
var path = require('path');

var models = require('../db/patch');
var Patch = models.Patch;
var analyze = require('../tools/zipAnalyze').analyze;

// 常量
var RES_STATUS = require('../constants/constants').RES_STATUS;

// 工具类
var pf = require('../tools/patchFile'); // 解析zip文件
var textract = require('textract'); // 解析doc && docx 文件
var mammoth = require("mammoth");  // 解析doc && docx 文件, 并将其转化为html
let cheerio = require('cheerio');

/**
 * 获取特定补丁的详细内容
 */
router.get('/', function (req, res) {
    var patchId = req.query.patchId;
    Patch.findOne({_id: patchId}, function (err, doc) {
        // console.log(doc.modifiedFiles);
        if (!err) {
            var results = {
                // 由旧补丁提供
                department: doc.department,
                author: doc.author,
                version: doc.version,
                time: doc.time,
                title: doc.title,
                modifiedFiles: doc.modifiedFiles,
                describe: doc.describe,
                modules: doc.modules,
                type: doc.type,

                // 由补丁系统生成
                patchId: doc._id,
                updateTime: doc.updateTime,
                link: doc.link,
                md5: doc.md5,
                isPreview: doc.isPreview,
            };
            res.json(results);
        } else {
            res.json({
                status: RES_STATUS.FAILURE,
                msg: err
            })
        }

    })
});

/**
 * 预览功能, 直接返回html页面
 */
router.get('/preview', function (req, res) {
    var patchId = req.query.patchId;
    console.log(patchId);
    Patch.findOne({_id: patchId}, function (err, doc) {
        res.send(doc.html);
    })
});

/**
 * 更新补丁的详细内容, 该方法实际调用了_uploadPatch方法对数据进行更新
 */
router.post('/', function (req, res) {
    _uploadPatch(req.body.patchId, req.body.patchContent,
        function () {
            res.json({
                status: RES_STATUS.SUCCESS,
                msg: "更新成功"
            })
        }, function () {
            res.json({
                status: RES_STATUS.FAILURE,
                msg: err
            })
        });
});

/**
 * 核心功能, 上传单个补丁文件, 读取并分析其中的信息, 该方法为上传补丁的唯一实现
 */
router.post('/upload', function (req, res) {
    // post 的信息
    var patchId = req.query.patchId;
    var categoryId = req.query.categoryId;

    // 根据categoryId 生成相应的文件目录
    var path = pf.checkPathExit(categoryId);
    // 新建post信息暂存文件
    var form = new multiparty.Form({uploadDir: path});

    // 上传后的处理
    form.parse(req, function (err, field, files) {
        if (files !== null) {
            var localPath = '', title = '';
            Object.keys(files).forEach(function (name) {
                title = name; // 真实的名字, eg:NCM_63_UFOC_汇率方案组织化动态支持合并数据折算.zip
                localPath = files[name][0].path; // temp文件, eg:public/files/57bd8bea416b7e8113c799be/2016-8/Z8gcdn-qeyRgAC-m2WHWhgXP.zip

                // MD5校验
                pf.MD5Test(localPath, function (md5) {
                    if(patchId) {pf.deleteOldPatchFile(patchId); /* 假如拥有patchId, 证明这个补丁之前即存在, 拥有旧的补丁包 */}
                    // 执行后台处理程序
                    const suffix = title.split('.').pop();
                    /*根据拓展名去选择对应的解析器(虽然目前解析器还没有完善)*/
                    switch(suffix) {
                        case 'zip':
                            // analyze分析补丁文件已获取额外的信息
                            analyze(localPath,
                                function (err, umsg, warningMsg) {
                                    umsg = _addAttribute(umsg, {categoryId: categoryId, title: title, md5: md5, link: _changePath(localPath), type: 'patch'});
                                    if(!err) {
                                        // 解析完毕, 将数据更新到数据库中
                                        _uploadPatch(patchId, umsg, function (id) {
                                            res.json({
                                                status: RES_STATUS.SUCCESS,
                                                patchId: id,
                                                warningMsg: warningMsg
                                            })
                                        }, function (err) {
                                            fs.unlinkSync(localPath);
                                            res.json({
                                                status: RES_STATUS.FAILURE,
                                                msg: '未知错误:' + err
                                            })
                                        })
                                    } else {
                                        fs.unlinkSync(localPath); // 上传了错误的文件,报错并删除之
                                        res.json({
                                            status: RES_STATUS.FAILURE,
                                            msg: '无法解析: 非zip文件'
                                        })
                                    }
                                }
                            );
                            break;
                        case 'docx': // docx将会把文件转变为网页,包括图片
                            mammoth.convertToHtml({path: localPath})
                                .then(function(result){
                                    var html = result.value;
                                    var messages = result.messages;
                                    const umsg = _addAttribute(null, {
                                        categoryId: categoryId,
                                        title: title,
                                        md5: md5,
                                        link: _changePath(localPath),
                                        html: html.toString(),
                                        describe: cheerio.load(html.toString()).text(), // 纯文本,
                                        isPreview: true,
                                        type: 'docx'
                                    });
                                    _uploadPatch(patchId, umsg, function (id) {
                                        res.json({
                                            status: RES_STATUS.SUCCESS,
                                            patchId: id
                                        })
                                    });
                                })
                                .done();
                            break;
                        case 'doc': // doc 仅仅支持将文件转变为文字
                            textract.fromFileWithPath(localPath, {preserveLineBreaks: true},
                                function (error, text) {
                                    const umsg = _addAttribute(null, {
                                        categoryId: categoryId,
                                        title: title,
                                        md5: md5,
                                        link: _changePath(localPath),
                                        describe: text, // 解析后的word 的文本,
                                        type: 'doc'
                                    });
                                    _uploadPatch(patchId, umsg, function (id) {
                                        res.json({
                                            status: RES_STATUS.SUCCESS,
                                            patchId: id
                                        })
                                    });
                            });
                            break;
                        default:
                            res.json({
                                status: RES_STATUS.FAILURE,
                                msg: '未法解析该后缀名的文件 : ' + suffix
                            })
                    }

                }, function (md5) {
                    res.json({
                        status: RES_STATUS.FAILURE,
                        msg: '已存在补丁, 请在左侧搜索特征值 : ' + md5
                    })
                })
            });
        }
    })
});

/**
 * 更新补丁信息, 当补丁不存在时, 则创建该id
 * @param patchId 补丁id
 * @param patchContent 补丁内容
 * @param successCall 成功的调用的方法, 将传入补丁id
 * @param errorCall 失败调用的方法, 将传入错误信息
 */
function _uploadPatch(patchId, patchContent, successCall, errorCall) {
    if(typeof patchId !== 'undefined') {
        // 当拥有patchid时, 更新时间和内容
        patchContent.updateTime = new Date();

        Patch.findOne({_id: patchId}, function (err, doc) {
            if(!err) {
                Patch.update({_id: patchId}, {
                    $set: patchContent
                }, function (err) {
                    if (!err) {successCall && successCall(patchId);}
                    else {  errorCall && errorCall(err);}
                })
            }
        });
    }else {
        // 新建
        var patch = new Patch(patchContent);
        patch.save(function (err) {
            if (!err) { successCall && successCall(patch._id);}
            else {  errorCall && errorCall(err);}
        })
    }
}

function _addAttribute(toObj, fromObj) {
    // copy attr from fromObj to toObj, 注意: 分析的内容若和该属性存在相同名字, 会覆盖原本属性
    toObj = toObj ? toObj : {};
    var attrs = Object.keys(fromObj);
    for(var i=0; i<attrs.length; i++) {
        var attrName = attrs[i];
        toObj[attrName] = fromObj[attrName];
    }
    return toObj;
}

/**
 * 针对特定路径, 去除默认的public路径
 * @param filePath
 * @returns {Array|*}
 * @private
 */
function _changePath(filePath) {
    // 下载链接
    console.log(filePath);
    var sep = path.sep;// 因为在win和mac下分割符不同,应返回path.sep
    var link = filePath.split(path.sep);
    link.shift(); // [public, files, filename], 除去public, 即结果 [files, filename]
    link = path.sep + link.join(path.sep);
    return link;
}

module.exports = router;
