const People = require("../models/people");

module.exports = {
  getSignup: function (req, res) {
    res.render("signup");
  },

  createUser: async function (req, res, next) {
    try {
      let newUser;
      let token;

      if (req.files && req.files.length > 0) {
        newUser = new People({ ...req.body, avatar: req.files[0].filename });
      } else {
        newUser = new People({ ...req.body });
      }

      await newUser.save();
      token = newUser.generateToken();

      res.cookie(process.env.COOKIE_NAME, token, {
        maxAge: 3600000,
        httpOnly: true,
        signed: true,
      });

      res.status(201).json({ message: "Your account has been created" });
    } catch (err) {
      next(err);
    }
  },
};
