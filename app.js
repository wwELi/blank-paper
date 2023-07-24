var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSession = require('express-session');
const cors = require('cors');

var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/users');
const authRouter = require('./src/routes/auth');
const fileRouter = require('./src/routes/file');
var passport = require('./src/config/passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 配置跨域
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './views')));
app.use(expressSession({
  // 你喜欢的任意名字作为一个加密用的字符串
  secret: 'SECRET',
  resave: true,
  saveUninitialized: true
}));
// 初始化调用 passport
app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter);
app.use('/api/file', fileRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, '404 Not Found'));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
