/**
 * Created by edeity on 16/8/16.
 */
// 定义返回的操作类型
var RES_STATUS = {
    SUCCESS: 1,
    FAILURE: 0
}
exports.RES_STATUS = RES_STATUS;

// 定义分类的级别
var CATEGORY_KIND = {
    // 系统级别的, 如垃圾箱
    SYSTEM: 0,
    // 常规类别, 一般不可新增, 如"企业报表"
    DEPARTMENT: 1,
    // 用户新建的, 如"个人文件夹"
    USERS: 9
}
exports.CATEGORY_KIND = CATEGORY_KIND;
