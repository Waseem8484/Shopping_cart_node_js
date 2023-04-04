const express = require("express");
const authController = require("../Controller/authController");
const Router = express.Router();

Router.post("/user/signup/", authController.singUp);
Router.post("/user/login/", authController.loginUser);
module.exports = Router;
