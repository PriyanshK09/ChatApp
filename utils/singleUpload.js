const multer = require("multer");
const path = require("path");

module.exports = function (subFolderPath, allowedFiletypes, maxFileSize, errorMsg) {
  const uploadsFolder = `${__dirname}/../public/uploads/${subFolderPath}`;
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsFolder);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") + "-" + Date.now();
      cb(null, fileName + fileExt);
    },
  });
  const upload = multer({
    storage: storage,
    limits: { fileSize: maxFileSize },
    fileFilter: (req, file, cb) => {
      if (allowedFiletypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb({ message: errorMsg });
      }
    },
  });
  return upload;
};
