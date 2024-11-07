const User = require('../models/User');

class UserService {
  // 创建新用户
  async register(email, password, salt) {
    try {

      console.log('Registering new user:', { username, email }); // 添加日志
      // 检查邮箱是否已存在
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // 检查用户名是否已存在
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        throw new Error('Username already taken');
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
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // 用户登录
  async login(email, password) {
    try {
      // 查找用户
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User email not found');
      }

      // 验证密码（password已经在前端加密）
      if (user.password !== password) {
        throw new Error('Invalid password');
      }

      // 返回用户信息（不包含敏感数据）
      return {
        success: true,
        user: {
          username: user.username,
          email: user.email,
          balance: user.balance,
          createdAt: user.createdAt
        }
      };
    } catch (error) {
      throw error;
    }
  }



  // 更新用户余额
  async updateBalance(email, amount) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      user.balance += amount; // 增加或减少余额
      await user.save();

      return { success: true, newBalance: user.balance };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();