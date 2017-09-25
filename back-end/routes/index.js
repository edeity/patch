var express = require('express');
var router = express.Router();

// 数据库
var models = require('../db/patch');
var Patch = models.Patch;

var RES_STATUS = require('../constants/constants').RES_STATUS;

/* 测试是否能链接到服务器 */
router.get('/', function(req, res, next) {
  res.json({
      status: RES_STATUS.SUCCESS
  });
});

module.exports = router;
