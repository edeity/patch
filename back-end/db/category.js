/**
 * Created by edeity on 16/8/10.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CATEGORY_KIND = require('../constants/constants').CATEGORY_KIND;

// 补丁目录
// Tips: 当你发现 unique等若干字段不起作用时, 请重启mongod, 具体方法(仅限本电脑) brew info mongo : brew service restart mongov

var _Category = new Schema({
    categoryKind: {type: Number, required: true, default: CATEGORY_KIND.USERS},
    categoryName: { type: String, required: true }
});

exports.Category = mongoose.model('Category', _Category);
exports.CategoryConstant = CATEGORY_KIND;