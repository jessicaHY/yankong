// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloud = require('./cloud');
var session = require('cookie-session')
var swig = require('swig');
var AV = require('leanengine');

var app = express();

// 设置 view 引擎
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));   // 设置模板目录
app.set('view engine', 'html');    // 设置 template 引擎
app.use(express.static('public'));

// 加载云代码方法
app.use(cloud);
app.use(require('./cloud/user'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(multer()); // for parsing multipart/form-data
app.use(AV.Cloud.CookieSession({ secret: 'yankong', maxAge: 3600000, fetchUser: true }));

// App 全局配置
//swig.setDefaults({ varControls: ['<%=', '%>'] });

//app.use(cookieParser('yankong'));
//app.use(avosExpressCookieSession({
//    cookie: { maxAge: 3600000 }
//}));

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

app.use('/', require('./routes/login'));
app.use('/', require('./routes/index'));
app.use('/', require('./routes/error'));

app.use('/manage', require('./routes/manageRole'));
app.use('/manage', require('./routes/manageUser'));
app.use('/manage', require('./routes/managePost'));

// 如果任何路由都没匹配到，则认为 404
// 生成一个异常让后面的 err handler 捕获
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.dir(err)
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// 如果是非开发环境，则页面只输出简单的错误信息
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;