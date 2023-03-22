const express = require("express");
const authController = require("./../Controller/authController");
const Router = express.Router();

Router.route("/Api/user/signup/").post(authController.singUp);
Router.route("/Api/user/login/").post(authController.loginUser);
module.exports = Router;
