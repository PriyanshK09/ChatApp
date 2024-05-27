const uploader = require("../utils/singleUpload");

module.exports = function (req, res, next) {
  const upload = uploader(
    "avatars",
    ["image/jpeg", "image/jpg", "image/png"],
    1000000,
    "Only .jpg, .jpeg and .png file formats are allowed"
  );

  upload.any()(req, res, (err) => {
    if (err) {
      res.status(400).json({ errors: { avatar: { msg: err.message } } });
      // process.env.NODE_ENV === "development" && console.log(err);
    } else {
      next();
    }
  });
};
