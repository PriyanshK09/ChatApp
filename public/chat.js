const socket = io();

const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const friendList = document.getElementById('friend-list');
const addFriendButton = document.getElementById('add-friend-button');
const friendUsernameInput = document.getElementById('friend-username');

// Function to render friends list
const renderFriends = (friends) => {
  friendList.innerHTML = '';
  friends.forEach(friend => {
    const li = document.createElement('li');
    li.textContent = friend.username;
    li.dataset.friendId = friend._id;
    friendList.appendChild(li);
  });
};

// Fetch friends on page load
const fetchFriends = async () => {
  try {
    const response = await fetch('/api/friend', {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    });

    if (response.ok) {
      const friends = await response.json();
      renderFriends(friends);
    } else {
      throw new Error('Failed to fetch friends.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while fetching friends.');
  }
};

// Function to remove a friend
const removeFriend = async (friendId) => {
  try {
    const response = await fetch('/api/friend/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ friendId })
    });

    if (response.ok) {
      const updatedUser = await response.json();
      renderFriends(updatedUser.friends);
    } else {
      const error = await response.json();
      alert(error.msg);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while removing the friend.');
  }
};

// Event listener for sending messages
sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message !== '') {
    socket.emit('sendMessage', {
      content: message,
      receiver: selectedFriendId // Add this line to send the receiver ID
    });
    messageInput.value = '';
  }
});

// Socket event listener for receiving messages
socket.on('message', (message) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
});

// Event listener for adding a friend
addFriendButton.addEventListener('click', async () => {
  const friendUsername = friendUsernameInput.value;
  try {
    const response = await fetch('/api/friend/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ friendUsername })
    });

    if (response.ok) {
      const updatedUser = await response.json();
      renderFriends(updatedUser.friends);
      friendUsernameInput.value = '';
    } else {
      const error = await response.json();
      alert(error.msg);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while adding the friend.');
  }
});

// Event listener for removing a friend
friendList.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const friendId = e.target.dataset.friendId;
    removeFriend(friendId);
  }
});

// Fetch friends on page load
fetchFriends();
