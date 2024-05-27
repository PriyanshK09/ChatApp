const mongoose = require("mongoose");

const dataSchema = mongoose.Schema(
  {
    text: { type: String },
    attachment: [],
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "People" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "People" },
    date_time: {
      type: Date,
      default: Date.now,
    },
    conversation_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", dataSchema);

module.exports = Message;
