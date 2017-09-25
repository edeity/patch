/**
 * Created by edeity on 16/8/10.
 */
var express = require('express');
var router = express.Router();

var models = require('../db/category');
var Category = models.Category;
var CATEGORY_KIND = require('../constants/constants').CATEGORY_KIND;
var RES_STATUS = require('../constants/constants').RES_STATUS;


// 懒惰人的做法..
init();
/**
* 本来是通过shell来初始化参数， 会遇到乱码问题， 不如用js写
*/ 
function init () {
    function createCategory (name, kind) {
        return new Category({
            categoryName : name,
            categoryKind: kind
        })
    }
    Category.findOne({
        categoryName: "回收站", categoryKind:CATEGORY_KIND.SYSTEM
    }, function  (err, doc) {
        if(!doc) {
           createCategory("企业报表", CATEGORY_KIND.DEPARTMENT).save();
           createCategory("合并报表", CATEGORY_KIND.DEPARTMENT).save();
           createCategory("XBRL", CATEGORY_KIND.DEPARTMENT).save();
           createCategory("全面预算", CATEGORY_KIND.DEPARTMENT).save();
           createCategory("计划平台", CATEGORY_KIND.DEPARTMENT).save();
           createCategory("数据方案", CATEGORY_KIND.DEPARTMENT).save();
           createCategory("回收站", CATEGORY_KIND.SYSTEM).save();
        }
    })
}

/**
 * 获取所有目录
  */
router.get('/', function (req, res) {
    Category.find({}, function (err, docs) {
        var results = [];
        docs.forEach(function (e) {
            results.push({
                categoryId: e._id,
                categoryName: e.categoryName,
                categoryKind: e.categoryKind
            })
        })
        res.json(results);
    })
});


/**
 * 获取垃圾箱id
 */
router.get('/dustbin', function (req, res) {
    // 获取垃圾箱的id
    var dustbinId = '';
// 预先查找垃圾箱id, 防止以后每次执行删除操作都删除垃圾箱
    Category.findOne({ categoryName: "回收站", categoryKind: CATEGORY_KIND.SYSTEM}, function (err, doc) {
        if(doc && doc._id) {
            dustbinId = doc._id;
            res.json({
                status: RES_STATUS.SUCCESS,
                dustbinId: dustbinId
            })
        } else {
            res.json({
                status: RES_STATUS.FAILURE,
                msg: '回收站分类id为空, 将无法删除补丁'
            })
        }

    });
})

/**
 * 创建新的个人目录
  */
router.post('/', function (req, res) {
    var categoryName = req.body.categoryName;
    var category = new Category({
        categoryName: categoryName,
        categoryKind: CATEGORY_KIND.USERS
    });

    category.save(function (err) {
        if(!err) {
            res.json({
                status: RES_STATUS.SUCCESS,
                msg: "创建成功"
            })
        } else {
            res.json({
                status: RES_STATUS.FAILURE,
                msg: err
            })
        }
    })
});

/**
 * 更新目录名称
  */
router.post('/update', function (req, res) {
    var categoryId = req.body.categoryId;
    var categoryName = req.body.categoryName;
    Category.findOne({ _id: categoryId}, function (err, doc) {
        doc.categoryName = categoryName;
        doc.save(function (err) {
            if(!err) {
                res.json({
                    status: RES_STATUS.SUCCESS,
                    msg: "更新成功"
                })
            } else {
                res.json({
                    status: RES_STATUS.FAILURE,
                    msg: err
                })
            }
        });
    });
});


module.exports = router;
