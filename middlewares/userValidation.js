const { check, validationResult } = require("express-validator");
const People = require("../models/people");
const { unlink } = require("fs");
const path = require("path");

const userValidations = [
  check("email")
    .isEmail()
    .withMessage("Your email is invalid")
    .trim()
    .custom(async (value) => {
      try {
        const user = await People.findOne({ email: value });
        if (user) {
          throw new Error("This email already exists");
        }
      } catch (err) {
        throw new Error(err.message);
      }
    }),
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required and must contain 5 chars")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must contain anything other than alphabet")
    .trim(),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    ),
];

function userValidationHandler(req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(path.join(__dirname, `/../public/uploads/avatars/${filename}`), (err) => {
        if (err) console.log(err.message || err);
      });
    }

    res.status(400).json({ errors: mappedErrors });
  }
}

module.exports = { userValidations, userValidationHandler };
