 // 定期更新余额
 async function updateBalance() {
  try {
    const response = await fetch('/api/balance');
    if (response.ok) {
      const data = await response.json();
      document.getElementById('balance').textContent = data.balance;
    }
  } catch (error) {
    console.error('Failed to update balance:', error);
  }
}
 // 每30秒更新一次余额
 setInterval(updateBalance, 30000);
