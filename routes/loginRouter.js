const express = require("express");

const router = express.Router();

// controllers
const { getLogin, login, logout } = require("../controllers/loginController");

// middlewares
const decorateHtmlResponse = require("../middlewares/decorateHtmlResponse");
const { redirectLoggedIn } = require("../middlewares/checkLogin");
const { loginValidation, loginValidationHandler } = require("../middlewares/loginValidation");

const pageTitle = "Login";

// for rendering the login page
router.get("/", decorateHtmlResponse(pageTitle), redirectLoggedIn, getLogin);

// process login
router.post("/", decorateHtmlResponse(pageTitle), loginValidation, loginValidationHandler, login);

// for logging out
router.delete("/", logout);

module.exports = router;
