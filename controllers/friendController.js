const User = require('../models/User');

// Add friend function
exports.addFriend = async (req, res) => {
  try {
    const { friendUsername } = req.body;
    const user = await User.findById(req.user.id);
    const friend = await User.findOne({ username: friendUsername });

    if (!friend) {
      return res.status(404).json({ msg: 'Friend not found' });
    }

    if (!user.friends.includes(friend.id)) {
      user.friends.push(friend.id);
      await user.save();
      res.json(user);
    } else {
      res.status(400).json({ msg: 'User is already a friend' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Remove friend function
exports.removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const user = await User.findById(req.user.id);
    user.friends = user.friends.filter(friend => friend.toString() !== friendId);
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get friends function
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', ['username']);
    res.json(user.friends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
