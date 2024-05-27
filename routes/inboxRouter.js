const express = require("express");

// middlewares
const decorateHtmlResponse = require("../middlewares/decorateHtmlResponse");
const { checkLogin } = require("../middlewares/checkLogin");
const attachmentUpload = require("../middlewares/attachmentUpload");

// controllers
const {
  getInbox,
  createConversation,
  getMessages,
  getConversationsInJSONformat,
  sendMessage,
} = require("../controllers/inboxController");

const router = express.Router();

// for rendering up the inbox page
router.get("/", decorateHtmlResponse("Inbox"), checkLogin, getInbox);

// for getting all the conversation of the logged in user in JSON format
router.get("/getConversationsInJSONformat", checkLogin, getConversationsInJSONformat);

// for creating a new conversation
router.post("/createConversation", checkLogin, createConversation);

// for getting all the messages of a particular conversation
router.get("/messages/:conversationId", checkLogin, getMessages);

// for sending a message to a particular conversation defined on the front-end
router.post("/message", checkLogin, attachmentUpload, sendMessage);

module.exports = router;
