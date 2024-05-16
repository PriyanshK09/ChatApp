// middleware/auth.js

const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, config.get('jwtSecret'));
    const user = await User.findById(decoded.user.id).select('-password');

    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    req.userData = user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
