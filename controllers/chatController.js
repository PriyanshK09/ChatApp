const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { receiver, content } = req.body;
  try {
    const newMessage = new Message({
      sender: req.user.id,
      receiver,
      content,
    });
    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getMessages = async (req, res) => {
  const { receiver } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver },
        { sender: receiver, receiver: req.user.id },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};