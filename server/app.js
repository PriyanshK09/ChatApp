// server/app.js
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');
const roomsRoutes = require('./routes/rooms');
const messagesRoutes = require('./routes/messages');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/messages', messagesRoutes);

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const users = {};
const rooms = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    users[socket.id] = roomName;

    if (!rooms[roomName]) {
      rooms[roomName] = [];
    }

    rooms[roomName].push(socket.id);

    socket.emit('roomHistory', rooms[roomName].history);

    socket.broadcast.to(roomName).emit('message', {
      username: 'System',
      text: `${socket.id} has joined the room`,
    });

    io.to(roomName).emit('rooms', Object.keys(rooms));
  });

  socket.on('sendMessage', ({ room, message }) => {
    if (rooms[room]) {
      rooms[room].push({
        username: socket.id,
        text: message,
        timestamp: new Date().toLocaleTimeString(),
      });

      io.to(room).emit('message', rooms[room][rooms[room].length - 1]);
    }
  });

  socket.on('startTyping', (room) => {
    socket.broadcast.to(room).emit('typing', [...new Set(rooms[room].map((id) => id))]);
  });

  socket.on('stopTyping', (room) => {
    socket.broadcast.to(room).emit('typing', []);
  });

  socket.on('disconnect', () => {
    const room = users[socket.id];
    if (room) {
      rooms[room] = rooms[room].filter((id) => id !== socket.id);
      socket.broadcast.to(room).emit('message', {
        username: 'System',
        text: `${socket.id} has left the room`,
      });
      io.to(room).emit('rooms', Object.keys(rooms));
    }
    delete users[socket.id];
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));