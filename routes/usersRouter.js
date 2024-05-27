const express = require("express");

// middlewares
const decorateHtmlResponse = require("../middlewares/decorateHtmlResponse");
const { checkLogin } = require("../middlewares/checkLogin");

const { getUsers, deleteUser, searchUsers } = require("../controllers/usersController");

const router = express.Router();

router.get("/", decorateHtmlResponse("Users"), checkLogin, getUsers);

router.delete("/:id", checkLogin, deleteUser);

router.post("/search", checkLogin, searchUsers);

module.exports = router;
