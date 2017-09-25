/**
 * Created by edeity on 16/8/10.
 */
var express = require('express');
var router = express.Router();

var models = require('../db/patch');
var Patch = models.Patch;
var Category = require('../db/category').Category;

// 常量
var constants = require('../constants/constants');

var RES_STATUS = constants.RES_STATUS;
var CATEGORY_KIND = constants.CATEGORY_KIND;

// 工具类
var pf = require('../tools/patchFile');

/**
 * 获取特定分类下的所有补丁列表
  */
router.get('/', function (req, res) {
    var categoryId = req.query.categoryId; // 分类的id
    var patchId = req.query.patchId; // 该值是用来优化查询的, 暂时未启用
    var pageNum = req.query.pageNum; // 分页的页数, 默认为1
    pageNum = pageNum > 0 ? pageNum : 1; // 总是大于或等于1
    var eachPageCount = 1000; // 每一页显示的页数
    
    // 根据id获取具体的分类类名
    Patch.find({categoryId: categoryId})
        .sort({'updateTime': -1})
        .skip((pageNum - 1) * eachPageCount)
        .limit(eachPageCount)
        .exec(function (err, docs) {
        var results = [];
        docs.forEach(function (doc) {
            results.push({
                title: doc.title,
                type: doc.type,
                time: doc.time,
                updateTime: doc.updateTime,
                patchId: doc._id,
                categoryId: doc.categoryId
            })
        });
        res.json(results);
    })
});

/**
 * 搜索
 * @deprecated 请使用elasticsearch接口
 */
router.get('/search', function (req, res) {
    res.json({status: RES_STATUS.FAILURE, msg:'请使用elasticsearch提供的搜索接口'});
})

/**
 * 更新补丁的分类
  */
router.post('/update', function (req, res) {
    var categoryId = req.body.categoryId;
    var patchId = req.body.patchId;
    // 根据id获取具体的分类类名
    Patch.findOne({_id: patchId}, function (err, doc) {
        doc.categoryId = categoryId;
        pf.moveFilePath(patchId, categoryId, function (realPath) {
            doc.link = realPath;
            doc.save(function (err) {
                if (!err) {

                        res.json({
                            status: RES_STATUS.SUCCESS,
                            msg: "更改补丁分类成功",
                            categoryId: doc.categoryId,
                        })
                }
                else {
                    res.json({
                        status: RES_STATUS.FAILURE,
                        msg: err
                    })
                }
            });
        });
    })
});

/**
 * 将补丁从当前目录移除到垃圾箱, 而不是真正地从硬盘空间删除掉
  */
router.post('/remove', function (req, res) {
    var dustbinId = '';
    Category.findOne({ categoryName: "回收站", categoryKind: CATEGORY_KIND.SYSTEM}, function (err, doc) {
        dustbinId = doc._id;
    });
    var patchId = req.body.patchId;
    Patch.findOne({_id: patchId}, function (err, doc) {
        doc.categoryId = dustbinId;
        pf.moveFilePath(patchId, dustbinId, function (realPath) {
            doc.link = realPath;
            doc.save(function (err) {
                if (!err) {
                    res.json({
                        status: RES_STATUS.SUCCESS,
                        msg: "删除补丁成功"
                    })
                }
                else {
                    res.json({
                        status: RES_STATUS.FAILURE,
                        msg: err
                    })
                }
            })
        });
    })
});

module.exports = router;
