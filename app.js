var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    ejs = require('ejs'),
    app = express();


// 模版引擎
app.set('views', path.join(__dirname, 'views'));
app.engine("html",require("ejs").__express); 
//app.set("view engine","ejs");
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//===============路由设置，转发到控制器===============
var routes = require('./routes/index');

// 调通测试
// app.get('/test', routes.test);
app.get('/', routes.index);
app.post('/todo/new', routes.new);
app.get('/todo/:id', routes.view);
app.get('/todo/:id/edit', routes.edit);
app.post('/todo/:id/edit', routes.save);
app.get('/todo/:id/delete', routes.delete);
app.get('/todo/:id/finish', routes.finish);


//===============连接数据库===============
var dao = require('./database/dao');

dao.connect(function(error){
    if (error) throw error;
});
// 监听到关闭窗口的时候，断开数据库
app.on('close', function(errno) {
    dao.disconnect(function(err) { });
});


//===============Express默认处理===============

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
