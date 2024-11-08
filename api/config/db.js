const mongoose = require('mongoose');
require('dotenv').config()

// 数据库连接URL
// const MONGODB_URI = 'mongodb://localhost:27017/casino_db';
const MONGODB_URI = process.env.MONGODB_URI;

// 连接数据库
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);// 如果连接失败，终止程序
  }
};

module.exports = {
  connectDB,
  MONGODB_URI  // 导出数据库连接字符串
};