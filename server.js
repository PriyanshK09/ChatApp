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

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
