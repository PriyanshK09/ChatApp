const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

// Route for user registration
router.post('/register', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], authController.register);

// Route for user login
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], authController.login);

// Route to authenticate user
router.post('/', [
  check('email', 'Please include a valid email').isEmail(),
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password is required').exists()
], authController.loginOrRegister);

// Route to get user by token
router.get('/', auth, authController.getUserByToken);

module.exports = router;
