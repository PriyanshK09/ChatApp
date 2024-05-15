const User = require('../models/User');

exports.addFriend = async (req, res) => {
  const { friendUsername } = req.body;
  try {
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

exports.removeFriend = async (req, res) => {
  const { friendId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.friends = user.friends.filter(friend => friend.toString() !== friendId);
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', ['username']);
    res.json(user.friends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
