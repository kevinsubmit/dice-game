// 规则弹出框控制
document.addEventListener('DOMContentLoaded', function() {
  // const rulesBtn = document.getElementById('rules-btn');
  const rulesModal = document.getElementById('rules-modal');
  const closeRules = document.querySelector('.close-rules');

  // 打开规则
  // rulesBtn.addEventListener('click', () => {
  //   rulesModal.style.display = 'block';
  // });

  // 关闭规则
  closeRules.addEventListener('click', () => {
    rulesModal.style.display = 'none';
  });

  // 点击外部关闭
  window.addEventListener('click', (e) => {
    if (e.target === rulesModal) {
      rulesModal.style.display = 'none';
    }
  });
});
