// server/routes/rooms.js
const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth');

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new room
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the room already exists
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room already exists' });
    }

    // Create a new room
    const newRoom = new Room({ name });

    // Save the room to the database
    const savedRoom = await newRoom.save();

    res.status(201).json(savedRoom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Join a room
router.post('/join', auth, async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.id;

    // Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if the user has already joined the room
    if (room.members.includes(userId)) {
      return res.status(400).json({ message: 'You have already joined this room' });
    }

    // Add the user to the room members
    room.members.push(userId);

    // Save the updated room
    const updatedRoom = await room.save();

    res.json(updatedRoom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Leave a room
router.post('/leave', auth, async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.id;

    // Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if the user is a member of the room
    if (!room.members.includes(userId)) {
      return res.status(400).json({ message: 'You are not a member of this room' });
    }

    // Remove the user from the room members
    room.members = room.members.filter((member) => member.toString() !== userId);

    // Save the updated room
    const updatedRoom = await room.save();

    res.json(updatedRoom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;