const express = require('express');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const app = express();

// Create HTTP server
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data storage
const users = [];
const groups = [];
let friendRequests = [];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.IO events
io.on('connection', (socket) => {
    console.log('A user connected');

    // User authentication
    socket.on('authenticate', async (userData) => {
        try {
            // Check if user exists
            const user = users.find((u) => u.username === userData.username);
            if (user) {
                // Compare password
                const isPasswordValid = await bcrypt.compare(userData.password, user.password);
                if (isPasswordValid) {
                    socket.emit('authenticated', user);
                } else {
                    socket.emit('authenticationError', 'Invalid password');
                }
            } else {
                // Create a new user
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(userData.password, salt);
                const newUser = {
                    id: socket.id,
                    username: userData.username,
                    password: hashedPassword,
                    friends: [],
                    groups: [],
                    profilePicture: null,
                };
                users.push(newUser);
                socket.emit('authenticated', newUser);
            }
        } catch (error) {
            console.error('Authentication error:', error);
            socket.emit('authenticationError', 'An error occurred during authentication');
        }
    });

    // Typing status
    socket.on('typing', (data) => {
        socket.broadcast.emit('typingStatus', data);
    });

    // Send message
    socket.on('sendMessage', (data) => {
        io.emit('newMessage', data);
    });

    // Create group
    socket.on('createGroup', (groupData) => {
        const group = {
            id: crypto.randomBytes(16).toString('hex'),
            name: groupData.name,
            members: [socket.id],
            admin: socket.id,
        };
        groups.push(group);
        const user = users.find((u) => u.id === socket.id);
        user.groups.push(group.id);
        socket.emit('groupCreated', group);
    });

    // Join group
    socket.on('joinGroup', (groupId) => {
        const group = groups.find((g) => g.id === groupId);
        if (group) {
            group.members.push(socket.id);
            const user = users.find((u) => u.id === socket.id);
            user.groups.push(group.id);
            socket.emit('joinedGroup', group);
        } else {
            socket.emit('error', 'Group not found');
        }
    });

    // Leave group
    socket.on('leaveGroup', (groupId) => {
        const group = groups.find((g) => g.id === groupId);
        if (group) {
            group.members = group.members.filter((memberId) => memberId !== socket.id);
            const user = users.find((u) => u.id === socket.id);
            user.groups = user.groups.filter((g) => g !== groupId);
            socket.emit('leftGroup', groupId);
        } else {
            socket.emit('error', 'Group not found');
        }
    });

    // Update profile
    socket.on('updateProfile', (profileData) => {
        const user = users.find((u) => u.id === socket.id);
        if (user) {
            user.profilePicture = profileData.profilePicture;
            socket.emit('profileUpdated', user);
        } else {
            socket.emit('error', 'User not found');
        }
    });

    // Send friend request
    socket.on('sendFriendRequest', (receiverId) => {
        const sender = users.find((u) => u.id === socket.id);
        const receiver = users.find((u) => u.id === receiverId);
        if (sender && receiver) {
            const request = { sender: sender.id, receiver: receiver.id };
            friendRequests.push(request);
            socket.emit('friendRequestSent', receiver.username);
            io.to(receiverId).emit('friendRequestReceived', sender.username);
        } else {
            socket.emit('error', 'User not found');
        }
    });

    // Accept friend request
    socket.on('acceptFriendRequest', (senderId) => {
        const sender = users.find((u) => u.id === senderId);
        const receiver = users.find((u) => u.id === socket.id);
        if (sender && receiver) {
            const request = friendRequests.find(
                (r) => r.sender === senderId && r.receiver === socket.id
            );
            if (request) {
                friendRequests.splice(friendRequests.indexOf(request), 1);
                sender.friends.push(receiver.id);
                receiver.friends.push(sender.id);
                io.to(senderId).emit('friendRequestAccepted', receiver.username);
                socket.emit('friendRequestAccepted', sender.username);
            } else {
                socket.emit('error', 'Friend request not found');
            }
        } else {
            socket.emit('error', 'User not found');
        }
    });

    // Reject friend request
    socket.on('rejectFriendRequest', (senderId) => {
        const sender = users.find((u) => u.id === senderId);
        const receiver = users.find((u) => u.id === socket.id);
        if (sender && receiver) {
            const request = friendRequests.find(
                (r) => r.sender === senderId && r.receiver === socket.id
            );
            if (request) {
                friendRequests.splice(friendRequests.indexOf(request), 1);
                io.to(senderId).emit('friendRequestRejected', receiver.username);
                socket.emit('friendRequestRejected', sender.username);
            } else {
                socket.emit('error', 'Friend request not found');
            }
        } else {
            socket.emit('error', 'User not found');
        }
    });

    // Remove friend
    socket.on('removeFriend', (friendId) => {
        const user = users.find((u) => u.id === socket.id);
        const friend = users.find((u) => u.id === friendId);
        if (user && friend) {
            user.friends = user.friends.filter((f) => f !== friendId);
            friend.friends = friend.friends.filter((f) => f !== socket.id);
            socket.emit('friendRemoved', friend.username);
            io.to(friendId).emit('friendRemoved', user.username);
        } else {
            socket.emit('error', 'User not found');
        }
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        // Remove user from users array and groups
        const user = users.find((u) => u.id === socket.id);
        if (user) {
            users.splice(users.indexOf(user), 1);
            groups.forEach((group) => {
                group.members = group.members.filter((memberId) => memberId !== socket.id);
                if (group.admin === socket.id) {
                    // If the user is the admin, assign a new admin or remove the group if no other members
                    if (group.members.length > 0) {
                        group.admin = group.members[0];
                    } else {
                        groups.splice(groups.indexOf(group), 1);
                    }
                }
            });
            user.friends.forEach((friendId) => {
                const friend = users.find((u) => u.id === friendId);
                if (friend) {
                    friend.friends = friend.friends.filter((f) => f !== socket.id);
                    io.to(friendId).emit('friendRemoved', user.username);
                }
            });
            friendRequests = friendRequests.filter(
                (r) => r.sender !== socket.id && r.receiver !== socket.id
            );
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
