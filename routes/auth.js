// routes/auth.js

const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const router = express.Router();

// Route for user registration
router.post('/register', [
  check('email', 'Please include a valid email').isEmail(),
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], authController.register);

// Route for user login
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], authController.login); // Make sure the callback function is defined properly

module.exports = router;
