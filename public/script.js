const socket = io();

const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const friendList = document.getElementById('friend-list');
const addFriendButton = document.getElementById('add-friend-button');
const friendUsernameInput = document.getElementById('friend-username');

// Ensure the friend list is rendered correctly
const renderFriends = (friends) => {
  friendList.innerHTML = '';
  friends.forEach(friend => {
    const li = document.createElement('li');
    li.textContent = friend.username;
    li.dataset.friendId = friend._id; // Make sure to include friend ID
    friendList.appendChild(li);
  });
};

// Add click event listener for friend list items
friendList.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const friendId = e.target.dataset.friendId;
    // Implement logic to open DM with the selected friend
    console.log('Clicked on friend with ID:', friendId);
  }
});

// Fetch friends on page load
const fetchFriends = async () => {
  try {
    const res = await fetch('/api/friend', {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    });
    const friends = await res.json();
    renderFriends(friends);
  } catch (err) {
    console.error(err);
  }
};

// Modify loginOrRegister function in public/script.js
const loginOrRegister = async () => {
  const email = prompt('Enter your email:');
  const password = prompt('Enter your password:');

  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const { token, username } = await res.json(); // Receive username from server
      localStorage.setItem('token', token);
      localStorage.setItem('username', username); // Store username in local storage
      // Display username on the webpage
      document.getElementById('username-display').textContent = `Logged in as: ${username}`;
      fetchFriends();
    } else {
      const error = await res.json();
      alert(error.msg);
    }
  } catch (err) {
    console.error(err);
  }
};

// Call loginOrRegister function on page load
loginOrRegister();

sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  socket.emit('sendMessage', message);
  messageInput.value = '';
});

socket.on('message', (message) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
});

addFriendButton.addEventListener('click', async () => {
  const friendUsername = friendUsernameInput.value;
  try {
    const res = await fetch('/api/friend/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ friendUsername })
    });

    if (res.ok) {
      const updatedUser = await res.json();
      renderFriends(updatedUser.friends);
      friendUsernameInput.value = '';
    } else {
      const error = await res.json();
      alert(error.msg);
    }
  } catch (err) {
    console.error(err);
  }
});

// Function to remove a friend
const removeFriend = async (friendId) => {
  try {
    const res = await fetch('/api/friend/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ friendId })
    });

    if (res.ok) {
      const updatedUser = await res.json();
      renderFriends(updatedUser.friends);
    } else {
      const error = await res.json();
      alert(error.msg);
    }
  } catch (err) {
    console.error(err);
  }
};

// Add event listener to friend list for removing friends
friendList.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const friendId = e.target.dataset.friendId;
    removeFriend(friendId);
  }
});