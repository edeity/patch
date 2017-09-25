/**
 * Created by edeity on 16/8/8.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 根据别人的补丁分析, 原有补丁packmedata.xml大概具有以下有用信息
 *
 *
 * 1. department, 部门:String
 * 2. author, 作者:String
 * 3. version, 版本:String
 * 4. time, 发布时间:Date(假如没有, 取管理系统补丁创建时间)
 * 5. supportId, 补丁id(对应支持网):String(该补丁不是该系统的id)
 * 6. title, 补丁名字(当没有时, 可以采用文件名):String
 * 7. modifiedFiles, 补丁修改类名:String(原来设计中为Array, 为方面全文搜索, 特地转变为"xxx,xxx,xxx的"格式)
 * 8. describe, 描述:String,
 * 9. modules, 代码设计模块:String
 * 10. type, 种类, 2017年拓展, patch不再代表一个补丁,而是一种资源
 *
 * 而根据程序需要, Patch需要以下额外信息
 * 1. categoryid, 分类标识
 * 2. patchId, 补丁id, 由mongoose生成并保持唯一
 * 3. updateTime, 修改时间, 每次post提交时自动更新
 * 4. link, 补丁链接, 由multiparty插件维护
 * 5. MD5, 用于检验是否重复上传的数值
 * 6. html, 便于预览的html(无图片)
 * 7. isPreview, 标示是否拥有预览功能(因为html包含图片太大, 应用标示为进行标示而不是通过html判断, 一般地,包含html的patch, isPreview为true)
 */
// 补丁内容, 一般为补丁的详细内容

var _Patch = new Schema({
    // 由旧补丁提供
    department: {type: String, default: 'NC'},
    author: {type: String, default: '未知'},
    version: {type: String, default: '未知'},
    time: {type: Date, default: new Date()},
    supportId: {type: String, default: '未知'},
    title: {type: String, default: '未命名'},
    modifiedFiles: {type: String, default: []},
    describe: {type: String, default: ''},
    modules: {type: String, default: []},
    type: {type: String, default: 'patch'},

    // 由补丁系统生成
    categoryId: {type: String, required: true}, // 必须要有categoryId
    // patchId: {type: String},
    updateTime: {type: Date, default: new Date()}, // 默认采取创建时的时间, 该事件为服务器默认启动事件
    link: {type: String},
    md5: {type: String},
    html: {type: String}, 
    isPreview: {type: Boolean, default: false},
})

exports.Patch = mongoose.model('Patch', _Patch);