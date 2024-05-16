document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      if (response.ok) {
        window.location.replace('chatapp.html');
      } else {
        const error = await response.json();
        alert(error.msg);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while logging in.');
    }
  });
  