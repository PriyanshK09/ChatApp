// server/routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Room = require('../models/Room');
const auth = require('../middleware/auth');

// Get messages for a room
router.get('/:roomId', auth, async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const messages = await Message.find({ room: roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send a new message
router.post('/', auth, async (req, res) => {
  try {
    const { roomId, text } = req.body;
    const userId = req.user.id;

    // Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if the user is a member of the room
    if (!room.members.includes(userId)) {
      return res.status(403).json({ message: 'You are not a member of this room' });
    }

    // Create a new message
    const newMessage = new Message({
      room: roomId,
      sender: userId,
      text,
    });

    // Save the message to the database
    const savedMessage = await newMessage.save();

    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;