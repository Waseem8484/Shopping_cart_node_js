const express = require("express");
const blogController = require("./../Controller/blogController");
const authController = require("./../Controller/authController");
const Router = express.Router();

Router.route("/Api/blogpost/")
  .get(blogController.getAllBlog)
  .post(blogController.createBlog);
Router.route("/Api/blogpost/:id")
  .get(blogController.getoneBlog)
  .delete(blogController.deleteBlog)
  .patch(blogController.updateBlog);
module.exports = Router;
