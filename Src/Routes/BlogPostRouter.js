const express = require("express");
const blogController = require("./../Controller/blogController");
const authController = require("./../Controller/authController");
const Router = express.Router();

Router.route("/reading").get(authController.Protect, blogController.getAllBlog);
Router.route("/creating").post(
  authController.Protect,
  blogController.createBlog
);
Router.route("/readingbyid/:id").get(
  authController.Protect,
  blogController.getoneBlog
);
Router.route("/deleting/:id").delete(
  authController.Protect,
  blogController.deleteBlog
);
Router.route("/updating/:id").patch(
  authController.Protect,
  blogController.updateBlog
);

module.exports = Router;
