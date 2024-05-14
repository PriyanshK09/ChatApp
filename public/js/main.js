const socket = io();

// Show login modal on page load
const loginModal = document.getElementById('login-modal');
loginModal.style.display = 'block';

// Handle modal close button clicks
const closeButtons = document.getElementsByClassName('close-btn');
for (let i = 0; i < closeButtons.length; i++) {
  closeButtons[i].onclick = function() {
    const modal = this.parentElement.parentElement;
    modal.style.display = 'none';
  }
}

// Handle login
const loginBtn = document.getElementById('login-btn');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');

loginBtn.addEventListener('click', () => {
  const username = usernameInput.value;
  const password = passwordInput.value;

  if (username && password) {
    socket.emit('authenticate', { username, password });
  }
});