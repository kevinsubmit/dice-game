 // 显示错误信息的函数
 function showError(message) {
  let errorDiv = document.querySelector(".error-message");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    form.insertBefore(errorDiv, form.firstChild);
  }
  errorDiv.textContent = message;
  errorDiv.style.display = "block";

  // 添加错误样式
  errorDiv.style.color = "#ff0000";
  errorDiv.style.backgroundColor = "#ffe6e6";
  errorDiv.style.padding = "10px";
  errorDiv.style.marginBottom = "10px";
  errorDiv.style.borderRadius = "4px";
  errorDiv.style.border = "1px solid #ff0000";

  setTimeout(() => {
    errorDiv.style.display = "none";
  }, 3000);
}
