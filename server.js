const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');


const app = express();
const Promise = require('bluebird');

require('dotenv').config()

// 连接数据库
connectDB();

// 设置视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 中间件设置
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'austinIsHandsome',// session密钥
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }// 生产环境使用secure cookie
}));



app.use(logger('dev'));
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: false })); // 解析URL编码的请求体
app.use(cookieParser()); // 解析cookie


// 根路由 - 重定向到登录页面
app.get('/', (req, res) => {
  res.redirect('/login');
});

// 添加 index 页面路由
app.get('/index', (req, res) => {
  // 检查用户是否已登录
  // if (!req.session.user) {
  //   return res.redirect('/login');
  // }
  res.render('index', { user: req.session.user });
});

// 登录页面路由
app.get('/login', (req, res) => {
  res.render('login');
});

// 注册页面路由
app.get('/register', (req, res) => {
  res.render('register');
});

app.use('/api',authRoutes); //设置路由前缀


// 404处理
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page not found' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});


// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

