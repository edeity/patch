// 使用库, 中间插件等
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 针对路径的action
var routes = require('./routes/index');
var users = require('./routes/users');
var categories = require('./routes/categories');
var lists = require('./routes/lists');
var patches = require('./routes/patches');

var app = express();

//测试: 允许跨域请求, 实际部署中不应该存在
app.all('*',function (req, res, next) {
    // 允许的域
    res.header('Access-Control-Allow-Origin', '*');
    // 允许的header类型
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    // 假如存在文件名, 则重命名文件名
    if(req.query.filename) {
        console.log(req.query.filename);
        res.attachment(req.query.filename);// Content-Disposition: attachment; filename="logo.png"
    }
    
    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

// 初始化引擎, 默认为jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 常用配置
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// url路径设定
app.use('/', routes);
app.use('/users', users);
app.use('/categories', categories);
app.use('/lists', lists);
app.use('/patches', patches);

// 链接数据库
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/patch');

// 处理404错误
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// 开发模式下, 输出错误信息
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// 生产模式下, 不输出错误信息
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
