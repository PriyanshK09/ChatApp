// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/chatApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;

// Check MongoDB connection
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Handle MongoDB connection error
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', authMiddleware, require('./routes/users'));
app.use('/api/messages', authMiddleware, require('./routes/messages'));

// Socket.io logic for real-time communication
io.on('connection', (socket) => {
  console.log('User connected');

  // Handle chat messages
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
