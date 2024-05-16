require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();

app.use(express.json({ extended: false }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/friend', require('./routes/friend'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Default route to serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle sending messages
  socket.on('sendMessage', (data) => {
    const { content, receiver } = data;
    // Implement the logic to save the message to the database
    console.log(`Received message: ${content} for receiver: ${receiver}`);
    // You can emit the message to the receiver's socket here
    io.emit('message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
