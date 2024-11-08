const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定义用户模式
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  balance: {
    type: Number,
    default: 1000  // 默认余额
  }
});

module.exports = mongoose.model('User', userSchema);