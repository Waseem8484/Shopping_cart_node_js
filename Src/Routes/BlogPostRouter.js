const express = require("express");
const blogController = require("../Controller/blogController");
const authController = require("../Controller/authController");
const meassageController = require("../Controller/messageController");
const Router = express.Router();

Router.get("/readingblog", authController.Protect, blogController.getAllBlog);
Router.post("/creatingblog", authController.Protect, blogController.createBlog);
Router.get(
  "/readingbyidpost/:id",
  authController.Protect,
  blogController.getoneBlog
);
Router.delete(
  "/deletingblog/:id",
  authController.Protect,
  blogController.deleteBlog
);
Router.patch(
  "/updatingblog/:id",
  authController.Protect,
  blogController.updateBlog
);
// message Api
Router.post(
  "/messagespost",
  authController.Protect,
  meassageController.postmessages
);
Router.get("/messages", authController.Protect, meassageController.getmessages);
Router.get("/qr", meassageController.generateqr);

module.exports = Router;
