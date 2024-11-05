
// 登录表单提交处理
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 重要：允许发送 cookies
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    console.log(data);

    if (data.success) {
      // 保存用户信息到 localStorage
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          username: data.user.username,
          email: data.user.email,
          balance: data.user.balance,
        })
      );
      // 跳转到主页
      window.location.href = "/index";
    } else {
      alert(data.message || "login failed");
    }
  } catch (error) {
    console.error("login error:", error);
    alert("登录失败: " + error.message);
  }
});


// 检查是否已经登录
// document.addEventListener("DOMContentLoaded", () => {
//   console.log("DOMContentLoaded是否执行");
//   // 检查 localStorage 中是否有用户信息
//   const userInfo = localStorage.getItem("userInfo");
//   if (userInfo) {
//     // 如果有用户信息，验证 session 是否还有效
//     checkSession();
//   }
// });

// 验证 session 是否有效
async function checkSession() {
  try {
    const response = await fetch("/api/check-session");
    const data = await response.json();

    console.log(response);

    if (data.success) {
      // session 有效，直接跳转到主页
      window.location.href = "/index";
    } else {
      // session 无效，清除本地存储
      // localStorage.removeItem("userInfo");
      console.log("session 无效，清除本地存储");
      // window.location.href = "/login";
    }
  } catch (error) {
    console.error("Session error:", error);
    
    // localStorage.removeItem("userInfo");
    // window.location.href = "/login";
  }
}

// 后续所有请求都需要带上 credentials
async function makeAuthenticatedRequest(url, options = {}) {
  return fetch(url, {
      ...options,
      credentials: 'include'  // 确保每个请求都带上 cookies
  });
}


// 工作流程：
// 用户首次登录时：
// 后端创建 session 并生成 sessionID
// express-session 自动将 sessionID 通过 cookie 发送给浏览器
// 浏览器自动保存这个 cookie
// 后续请求：
// 浏览器自动在每个请求中带上 cookie（包含 sessionID）
// 后端通过 sessionID 识别用户
// 不需要手动管理 sessionID
// 关键点：
// 使用 credentials: 'include' 允许跨域请求携带 cookies
// 不需要手动管理 sessionID，全部由 express-session 和浏览器自动处理
// localStorage 只用来存储用户信息，session 管理完全依赖 cookies
// 这样的好处是：
// 1. 更安全（sessionID 在 cookie 中，不容易被 XSS 攻击）
// 2. 更简单（大部分工作由框架处理）
// 更可靠（使用标准的 session 机制）

// 工作流程：
// 用户登录时：
// 创建新的 session
// 存储到 MongoDB
// 发送 sessionID 给客户端（通过 cookie）
// 每次请求时：
// 从 cookie 获取 sessionID
// 在 MongoDB 中查找对应的 session
// 检查是否过期
// 验证用户信息
// session 过期：
// MongoDB 自动删除过期的 session 文档
// 或者手动调用 req.session.destroy()



// 使用 connect-mongo 后： 
// session 会自动存储在 MongoDB 中
// 可以设置 TTL (Time To Live) 来自动过期
// session 数据结构大概是这样：
// {
//   _id: "session_id",
//   expires: ISODate("2024-03-21..."),
//   session: {
//       cookie: { ... },
//       user: {
//           id: "user_id",
//           username: "username",
//           ...
//       }
//   }
// }