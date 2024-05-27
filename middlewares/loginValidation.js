const { check, validationResult } = require("express-validator");

const loginValidation = [
  check("email").isEmail().withMessage("Email is required and it must be a valid one"),
  check("password").isLength({ min: 1 }).withMessage("Password is required"),
];

const loginValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.render("index", {
      data: { email: req.body.email, password: req.body.password },
      errors: mappedErrors,
    });
  }
};

module.exports = { loginValidation, loginValidationHandler };
