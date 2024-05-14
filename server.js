// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Array to store connected users
let users = [];

// Event listener for new connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send the list of users to the client
    io.emit('userList', users);

    // Event listener for typing status
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);
    });

    // Event listener for sending messages
    socket.on('message', (data) => {
        io.emit('message', data);
    });

    // Event listener for adding a new user
    socket.on('addUser', (username) => {
        users.push(username);
        io.emit('userList', users);
    });

    // Event listener for disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        users = users.filter(user => user !== socket.username);
        io.emit('userList', users);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
