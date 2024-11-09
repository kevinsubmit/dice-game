const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const { connectDB, MONGODB_URI } = require('./api/config/db');

const authRoutes = require('./api/routes/auth');


const app = express();
const Promise = require('bluebird');
require('dotenv').config()


app.use(logger('dev'));
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: false })); // 解析URL编码的请求体
app.use(cookieParser()); // 解析cookie

// 连接数据库
connectDB();

// 设置视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 中间件设置  // Session 配置
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'austinIsHandsome',// session密钥
  resave: false,//强制保存session，即使它并没有变化g
  saveUninitialized: false,//强制将未初始化的session存储
  store: MongoStore.create({
    mongoUrl: MONGODB_URI, // 你的 MongoDB 连接字符串
    ttl: 24 * 60 * 60 // session 过期时间（秒）
}),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000  // 24小时  过期时间
  }
}));

// index 路由
app.get('/', (req, res) => {
  res.render('login');
  
});

// index 路由
app.get('/index', (req, res) => {
  res.render('index');
  
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



// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

