const loginBtn = document.querySelector('.login-btn');

loginBtn.addEventListener('click', (event) => {
  event.preventDefault(); 
  window.location.href = './src/pages/Dashboard.html';
});