const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addFriend, removeFriend, getFriends } = require('../controllers/friendController');

router.post('/add', auth, addFriend);
router.post('/remove', auth, removeFriend);
router.get('/', auth, getFriends);

module.exports = router;
