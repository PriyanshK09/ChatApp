const People = require("../models/people");
const { unlink } = require("fs");
const path = require("path");
const escape = require("../utils/escape");

module.exports = {
  getUsers: async function (req, res, next) {
    try {
      const users = await People.find({});
      res.render("users", { users });
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async function (req, res, next) {
    try {
      const { id: userId } = req.params;
      const user = await People.findByIdAndDelete({ _id: userId });

      if (user?.avatar) {
        unlink(path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }

      res.status(201).json({ message: "User was deleted successfully" });
    } catch (err) {
      next(err);
    }
  },

  searchUsers: async function (req, res) {
    try {
      const { queryText } = req.body;
      const nameSearchRegex = new RegExp(escape(queryText), "i");
      const emailSearchRegex = new RegExp("^" + escape(queryText) + "$", "i");

      if (queryText !== "") {
        const results = await People.find(
          { $or: [{ name: nameSearchRegex }, { email: emailSearchRegex }] },
          "name avatar"
        );

        res.json({ results });
      } else {
        throw new Error("Please type something to search");
      }
    } catch (err) {
      res.status(500).json({
        errors: { common: { msg: err.message } },
      });
    }
  },
};
