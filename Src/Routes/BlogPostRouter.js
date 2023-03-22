const express = require("express");
const blogController = require("./../Controller/blogController");
const authController = require("./../Controller/authController");
const Router = express.Router();

Router.route("/Api/blogpost/")
  .get(authController.Protect, blogController.getAllBlog)
  .post(authController.Protect, blogController.createBlog);
Router.route("/Api/blogpost/:id")
  .get(authController.Protect, blogController.getoneBlog)
  .delete(authController.Protect, blogController.deleteBlog)
  .patch(authController.Protect, blogController.updateBlog);
module.exports = Router;
