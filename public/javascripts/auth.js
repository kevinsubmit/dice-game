document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  
  // 生成随机salt的函数
  function generateSalt(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let salt = '';
    for (let i = 0; i < length; i++) {
      salt += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return salt;
  }

  // 使用salt加密密码的函数
  function hashPasswordWithSalt(password, salt) {
    const combinedPassword = password + salt;
    return CryptoJS.MD5(combinedPassword).toString();
  }
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username')?.value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // 表单验证
    if (form.id === 'registerForm') {
      if (!username || username.length < 2 || username.length > 20) {
        showError('Username must be between 2 and 20 characters');
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Please enter a valid email address');
      return;
    }
    
    if (password.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }

    // 生成salt并加密密码
    const salt = generateSalt();
    const hashedPassword = hashPasswordWithSalt(password, salt);
    
    if (form.id === 'registerForm') {
      const confirmPassword = document.getElementById('confirmPassword').value;
      if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
      }
      
      try {
        console.log('Sending registration request...'); // 调试日志
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            username,
            email, 
            password: hashedPassword,
            salt
          })
        });
        
        console.log('Registration response:', response); // 调试日志
        const data = await response.json();
        console.log('Registration data:', data); // 调试日志
        
        if (response.ok) {
          window.location.href = '/login';
        } else {
          showError(data.message || 'Registration failed');
        }
      } catch (error) {
        console.error('Registration error:', error); // 调试日志
        showError('An error occurred. Please try again.');
      }
    } else {
      // 登录逻辑
      try {
        // 先获取用户的salt
        const saltResponse = await fetch(`/api/get-salt?email=${encodeURIComponent(email)}`);
        const saltData = await saltResponse.json();
        
        if (!saltResponse.ok) {
          showError('Invalid email or password');
          return;
        }

        // 使用获取到的salt来加密密码
        const hashedPassword = hashPasswordWithSalt(password, saltData.salt);
        
        const loginResponse = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email, 
            password: hashedPassword
          })
        });
        
        const data = await loginResponse.json();
        if (loginResponse.ok) {
          window.location.href = '/index';
        } else {
          showError(data.message || 'Login failed');
        }
      } catch (error) {
        // console.error('Login error:', error); // 调试日志
        showError('An error occurred. Please try again.');
      }
    }
  });
  
  // 显示错误信息的函数
  function showError(message) {
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      form.insertBefore(errorDiv, form.firstChild);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // 添加错误样式
    errorDiv.style.color = '#ff0000';
    errorDiv.style.backgroundColor = '#ffe6e6';
    errorDiv.style.padding = '10px';
    errorDiv.style.marginBottom = '10px';
    errorDiv.style.borderRadius = '4px';
    errorDiv.style.border = '1px solid #ff0000';
    
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 3000);
  }
});