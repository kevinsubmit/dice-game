async function updateBalance() {
  try {
    const response = await fetch('/api/balance');
    if (response.status === 401) {
      // 如果未登录，重定向到登录页面
      window.location.href = '/login';
      return;
    }
    
    if (response.ok) {
      const data = await response.json();
      document.getElementById('balance').textContent = data.balance;
    } else {
      console.error('Failed to update balance:', await response.text());
    }
  } catch (error) {
    console.error('Balance update error:', error);
  }
}

// 页面加载时更新余额
// updateBalance();

// 每30秒更新一次余额
// setInterval(updateBalance, 30000);