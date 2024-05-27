const express = require("express");

const router = express.Router();

// controllers
const { getSignup, createUser } = require("../controllers/signupController");

// middlewares
const avatarUpload = require("../middlewares/avatarUpload");
const { redirectLoggedIn } = require("../middlewares/checkLogin");
const decorateHtmlResponse = require("../middlewares/decorateHtmlResponse");
const { userValidations, userValidationHandler } = require("../middlewares/userValidation");

// signup page
router.get("/", decorateHtmlResponse("Signup"), redirectLoggedIn, getSignup);

// for creating a new user
router.post("/", avatarUpload, userValidations, userValidationHandler, createUser);

module.exports = router;
