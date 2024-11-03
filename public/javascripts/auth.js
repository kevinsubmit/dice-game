document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Please enter a valid email address');
      return;
    }
    
    // 密码长度验证
    if (password.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }
    
    if (form.id === 'registerForm') {
      const confirmPassword = document.getElementById('confirmPassword').value;
      if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
      }
      
      // 注册请求
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();

        


        if (response.ok) {
          window.location.href = '/login';
        } else {
          showError(data.message || 'Registration failed');
        }
      } catch (error) {

        window.location.href = '/login';//测试 后期数据库后去掉这行
        return false;//测试 后期数据库后去掉这行

        showError('An error occurred. Please try again.');
      }
      
    } else {
      // 登录请求
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();

       

        if (response.ok) {
          window.location.href = '/dashboard';
        } else {
          showError(data.message || 'Login failed');
        }
      } catch (error) {


        window.location.href = '/';//测试 后期通数据库后去掉这行
        return false;//测试 后期通数据库后去掉这行


        showError('An error occurred. Please try again.');
      }
    }
  });
  
  function showError(message) {
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      form.insertBefore(errorDiv, form.firstChild);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 3000);
  }
});