const mongoose = require("mongoose");

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

const blogpost = mongoose.model("BlogPost", Blogschema);
module.exports = blogpost;
