// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var swig = require('swig');
var avosExpressCookieSession = require('avos-express-cookie-session');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

// App 全局配置
//swig.setDefaults({ varControls: ['<%=', '%>'] });
app.engine('html', swig.renderFile);
app.set('view engine', 'html');    // 设置 template 引擎
app.set('views','cloud/views');   // 设置模板目录
//app.use(express.bodyParser());    // 读取请求 body 的中间件

app.locals.TITILE = '颜控管理后台';

app.use(cookieParser('yankong'));
app.use(avosExpressCookieSession({
    cookie: { maxAge: 3600000 }
}));

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

require('cloud/routes/post').run(app);
require('cloud/routes/index').run(app);
require('cloud/routes/role').run(app);
require('cloud/routes/login').run(app);
require('cloud/routes/manageUser').run(app);
require('cloud/routes/manageUser').run(app);

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();