const mongoose = require("mongoose");
const AppError = require("../Utilis/AppError");

const Blogschema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "Must be title"],
  },
  content: {
    type: String,
    require: [true, "Must be Content"],
  },
  author: {
    type: String,
    require: [true, "Must be Auther"],
  },
});
Blogschema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    return next(new AppError("There was a duplicate key error"));
  } else {
    return next();
  }
});
const blogpost = mongoose.model("BlogPost", Blogschema);
module.exports = blogpost;
