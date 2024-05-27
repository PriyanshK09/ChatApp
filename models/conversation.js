const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "People" },
    participant: { type: mongoose.Schema.Types.ObjectId, ref: "People" },
    last_updated: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

const Conversation = new mongoose.model("Conversation", dataSchema);

module.exports = Conversation;
