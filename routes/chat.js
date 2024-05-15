const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sendMessage, getMessages } = require('../controllers/chatController');

router.post('/send', auth, sendMessage);
router.get('/:receiver', auth, getMessages);

module.exports = router;
