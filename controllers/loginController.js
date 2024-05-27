const People = require("../models/people");
const bcrypt = require("bcrypt");

module.exports = {
  getLogin: function (req, res) {
    res.render("index");
  },

  login: async function (req, res, next) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const user = await People.findOne({ email });

      if (user && user._id) {
        const passwordMatched = await bcrypt.compare(password, user.password);

        if (passwordMatched) {
          const token = await user.generateToken();

          res.cookie(process.env.COOKIE_NAME, token, {
            maxAge: 3600000,
            httpOnly: true,
            signed: true,
          });

          res.locals.loggedInUser = {
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          };

          res.redirect("/inbox");
        } else {
          throw new Error("Invalid Password");
        }
      } else {
        throw new Error("Your account doesn't exists");
      }
    } catch (err) {
      res.status(500);
      res.render("index", {
        data: { email: req.body.email, password: req.body.password },
        errors: { common: { msg: err.message } },
      });
    }
  },

  logout: function (req, res, next) {
    res.clearCookie(process.env.COOKIE_NAME);
    res.json({ message: "Logged Out" });
  },
};
