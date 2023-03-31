const express = require("express");
const authController = require("./../Controller/authController");
const Router = express.Router();

Router.post("/Api/user/signup/", authController.singUp);
Router.post("/Api/user/login/", authController.loginUser);
module.exports = Router;
