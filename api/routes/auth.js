const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 注册路由  注册这部分是没问题的
router.post("/register", async (req, res) => {
  try {
    console.log("Register request body:", req.body);

    const { username, email, password} = req.body;

    // 验证必填字段
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        details: {
          username: !username,
          email: !email,
          password: !password,
        },
      });
    }

    // 验证用户名长度
    if (username.length < 2 || username.length > 20) {
      return res.status(400).json({
        message: "Username must be between 2 and 20 characters",
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // 检查用户名是否已存在，防止用户名重复
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        message: "Username already taken",
      });
    }

    // 创建新用户
    const newUser = new User({
      username,
      email,
      password, // 已经在前端加密
    });

    // 保存到数据库
    await newUser.save();
    console.log("User registered successfully:", newUser._id);

    res.json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});


// 登录路由
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });


    if (!user) {
      return res.status(401).json({ message: "usernmae is error" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "password is error" });
    }

    // 1. 设置 session（存储在服务器）
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      balance: user.balance,
    };

    // 2. express-session 会自动设置一个 cookie
    // 这个 cookie 只包含 session ID
    // 类似这样：connect.sid=s%3A12345...

    // 保存session并发送响应
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Login failed" });
      }
       // 设置 cookie 并发送响应
       res.cookie('sessionId', req.sessionID, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      }).json({
        success: true,
        user: {
          username: user.username,
          email: user.email,
          balance: user.balance,
        },
        sessionId: req.sessionID,
      });
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
    });
  }
});

// // 登出路由
// router.post("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error("Logout error:", err);
//       return res.status(500).json({
//         message: "Logout failed",
//         error: err.message,
//       });
//     }

//     res.json({
//       success: true,
//       message: "Logged out successfully",
//     });
//   });
// });

// // 检查 session 状态
// // 检查 session 状态的路由
// router.get('/check-session', async (req, res) => {
//   try {
//       // 1. 检查是否有 session
//       if (!req.session || !req.session.user) {
//           return res.json({
//               success: false,
//               message: 'Session is not exist'
//           });
//       }

//       // 2. 从数据库获取 session
//       const sessionStore = req.sessionStore;
//       sessionStore.get(req.sessionID, async (error, session) => {
//           if (error) {
//               console.error('Session 获取错误:', error);
//               return res.status(500).json({
//                   success: false,
//                   message: 'Server error'
//               });
//           }

//           // 3. 验证 session 是否存在且未过期
//           if (!session) {
//               return res.json({
//                   success: false,
//                   message: 'Session is expired'
//               });
//           }

//           // 4. 验证用户信息
//           const user = await User.findById(session.user.id);
//           if (!user) {
//               // session 有效但用户不存在，清除 session
//               req.session.destroy();
//               return res.json({
//                   success: false,
//                   message: 'User is not exist'
//               });
//           }

//           // 5. 更新 session
//           req.session.user = {
//               id: user._id,
//               username: user.username,
//               email: user.email,
//               balance: user.balance
//           };

//           res.json({
//               success: true,
//               user: {
//                   username: user.username,
//                   email: user.email,
//                   balance: user.balance
//               }
//           });
//       });

//   } catch (error) {
//       console.error('Session check error:', error);
//       res.status(500).json({
//           success: false,
//           message: 'Server error'
//       });
//   }
// });

// // 登出路由
// router.post('/logout', (req, res) => {
//   req.session.destroy((err) => {
//       if (err) {
//           return res.status(500).json({
//               success: false,
//               message: 'logout failed'
//           });
//       }
      
//       res.json({
//           success: true,
//           message: 'logout success'
//       });
//   });
// });

    
// // 添加一个获取余额的路由
// router.get("/balance", async (req, res) => {
//   try {
//     // 检查用户是否登录
//     if (!req.session.user) {
//       return res.status(401).json({ message: "Not logged in" });
//     }

//     // 从数据库获取最新余额
//     const user = await User.findById(req.session.user.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     // 更新session中的余额
//     req.session.user.balance = user.balance;
//     res.json({ balance: user.balance });
//   } catch (error) {
//     console.error("Get balance error:", error);
//     res.status(500).json({ message: "Failed to get balance" });
//   }
// });


// module.exports = router;
