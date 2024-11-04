const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 注册路由
router.post('/register', async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    
    const { username, email, password, salt } = req.body;
    
    // 验证必填字段
    if (!username || !email || !password || !salt) {
      return res.status(400).json({
        message: 'All fields are required',
        details: {
          username: !username,
          email: !email,
          password: !password,
          salt: !salt
        }
      });
    }

    // 验证用户名长度
    if (username.length < 2 || username.length > 20) {
      return res.status(400).json({
        message: 'Username must be between 2 and 20 characters'
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format'
      });
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        message: 'Username already taken'
      });
    }

    // 创建新用户
    const newUser = new User({
      username,
      email,
      password, // 已经在前端加密
      salt
    });

    // 保存到数据库
    await newUser.save();
    console.log('User registered successfully:', newUser._id);

    res.json({
      success: true,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Registration failed',
      error: error.message
    });
  }
});

// 获取salt路由
router.get('/get-salt', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // 返回随机salt以防止用户枚举
      return res.json({ salt: generateRandomSalt() });
    }

    res.json({ salt: user.salt });
  } catch (error) {
    console.error('Get salt error:', error);
    res.status(500).json({
      message: 'Failed to get salt',
      error: error.message
    });
  }
});

// 登录路由
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // 验证密码
    if (user.password !== password) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // 设置session
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      balance: user.balance
    };

    res.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        balance: user.balance
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Login failed',
      error: error.message
    });
  }
});

// 登出路由
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({
        message: 'Logout failed',
        error: err.message
      });
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

// 添加一个获取余额的路由
router.get('/balance', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ balance: user.balance });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Failed to get balance' });
  }
});

// 生成随机salt的辅助函数
function generateRandomSalt(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let salt = '';
  for (let i = 0; i < length; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return salt;
}

module.exports = router;