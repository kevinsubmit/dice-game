document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Please enter a valid email address');
      return;
    }
    
    if (password.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }

    
    // 如果form是登录表单，则进行登录表单验证
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
            password
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