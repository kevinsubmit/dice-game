async function logout() {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      window.location.href = '/login';
    } else {
      alert('登出失败，请重试');
    }
  } catch (error) {
    console.error('Logout error:', error);
    alert('登出失败，请重试');
  }
}