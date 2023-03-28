const express = require("express");
const blogController = require("./../Controller/blogController");
const authController = require("./../Controller/authController");
const Router = express.Router();

// Router.route("/Api/blogpost/")
//   .get(authController.Protect, blogController.getAllBlog)
//   .post(authController.Protect, blogController.createBlog);

Router.route("/reading").get(authController.Protect, blogController.getAllBlog);
Router.route("/creating").post(blogController.createBlog);
Router.route("/readingbyid/:id").get(blogController.getoneBlog);
Router.route("/deleting/:id").delete(blogController.deleteBlog);
Router.route("/updating/:id").patch(blogController.updateBlog);

module.exports = Router;
