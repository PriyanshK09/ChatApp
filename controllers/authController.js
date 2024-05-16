// Import necessary modules
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Register function
exports.register = async (req, res) => {
  try {
    // Sanitize and validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create a new user
    const { email, password, username } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ email, password, username });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Return success message and username
    res.json({ msg: 'User registered successfully', username: user.username });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login function
exports.login = async (req, res) => {
  try {
    // Sanitize and validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find user
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate token and return username
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, username: user.username });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


// Login or register function
exports.loginOrRegister = async (req, res) => {
  try {
    // Sanitize and validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user exists
    const { email, password, username } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      // Register user
      user = new User({ email, password, username });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      return res.json({ msg: 'User registered successfully' });
    }

    // Login user
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user by token
exports.getUserByToken = async (req, res) => {
  try {
    // Get user by token
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
