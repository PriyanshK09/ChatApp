const Conversation = require("../models/conversation");
const Message = require("../models/message");

module.exports = {
  getInbox: async function (req, res, next) {
    try {
      const conversations = await Conversation.find({
        $or: [{ creator: req.user._id }, { participant: req.user._id }],
      })
        .populate("creator participant")
        .sort({ updatedAt: -1 });
      res.locals.data = conversations;
      res.render("inbox");
    } catch (err) {
      next(err);
    }
  },

  getConversationsInJSONformat: async function (req, res, next) {
    try {
      const conversations = await Conversation.find({
        $or: [{ creator: req.user._id }, { participant: req.user._id }],
      })
        .sort({ updatedAt: -1 })
        .populate("creator participant");

      res.send(conversations);
    } catch (err) {
      next(err);
    }
  },

  createConversation: async function (req, res) {
    try {
      const newConversation = new Conversation({
        creator: req.user._id,
        participant: req.body.id,
      });

      await newConversation.save();

      res.status(201).json({
        message: "Conversation was added successfully!",
      });
    } catch (err) {
      res.status(500).json({
        errors: { common: { msg: err.message } },
      });
    }
  },

  getMessages: async function (req, res) {
    try {
      const messages = await Message.find({ conversation_id: req.params.conversationId })
        .sort("createdAt")
        .populate("sender receiver");
      const { participant, creator } = await Conversation.findById(req.params.conversationId).populate(
        "creator participant"
      );

      res.status(201).json({
        data: { messages, participant, creator },
        user: req.user._id,
        conversation_id: req.params.conversationId,
      });
    } catch (err) {
      res.status(500).json({
        errors: { common: { msg: err.message || "Unknown error occurred" } },
      });
    }
  },

  sendMessage: async function (req, res) {
    try {
      if (req.body.message || (req.files && req.files.length > 0)) {
        let attachments = null;

        if (req.files && req.files.length > 0) {
          attachments = [];
          for (let i = 0; i < req.files.length; i++) {
            attachments.push(req.files[i].filename);
          }
        }

        const newMessage = new Message({
          text: req.body.message,
          attachment: attachments,
          sender: req.user._id,
          receiver: req.body.receiverId,
          conversation_id: req.body.conversationId,
        });

        await newMessage.save();
        await Conversation.updateOne({ _id: req.body.conversationId }, { last_updated: Date.now() });

        res.status(201).json({ msg: "Your message has been sent" });
      }
    } catch (err) {
      console.log("there was an error", err);
      res.status(500).json({
        errors: { common: { msg: err.message } },
      });
    }
  },
};
