const uploader = require("../utils/multipleUploader");

module.exports = function (req, res, next) {
  const upload = uploader(
    "attachments",
    ["image/jpg", "image/jpeg", "image/png"],
    1000000,
    4,
    "Only .jpg, .png and .jpeg file formats are allowed"
  );

  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: { avatar: { msg: err.message } },
      });
    } else {
      next();
    }
  });
};
