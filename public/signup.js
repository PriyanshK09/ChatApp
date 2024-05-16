document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
  
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = document.getElementById('email').value;
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, username, password })
        });
  
        if (response.ok) {
          // Redirect to login page upon successful signup
          window.location.href = 'index.html';
        } else {
          const error = await response.json();
          alert(error.msg);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while signing up.');
      }
    });
  });
  