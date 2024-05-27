module.exports = {
  notFoundHandler: function (req, res, next) {
    next({ status: 404, message: "Your requested route was not found" });
  },
  errorHandler: function (err, req, res, next) {
    res.locals.error = process.env.NODE_ENV === "development" ? err : { message: err.message };

    res.status(err.status || 500);

    if (res.locals.html) {
      res.render("error", {
        title: err.message,
      });
    } else {
      res.json({ status: err.status, message: err.message });
    }
  },
};
