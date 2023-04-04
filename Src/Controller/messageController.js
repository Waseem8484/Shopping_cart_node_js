const message = require("../Model/MessageModel");
const express = require("express");
const QRCode = require("qrcode");
const AppError = require("../Utilis/AppError");
const socketio = require("socket.io");
const io = require("socket.io");
const sockets = io();
const app = express();
const socketHandler = require("../Utilis/SoketHandler").default;
app.use(express.json());

exports.getmessages = async (req, res, next) => {
  try {
    const messages = await message.find();
    socketHandler("message", req.body);
    res.status(200).json({
      status: "success",
      data: {
        messages: messages,
      },
    });
  } catch (error) {
    console.log("error", error);
    return next(new AppError("SomeThing Went wrong", 404));
  }
};

exports.postmessages = async (req, res, next) => {
  try {
    const messages = await message.create(req.body);
    const savemes = await messages.save();
    res.status(201).json({
      status: "success",
      data: {
        savemes,
      },
    });
  } catch (error) {
    console.log("error", error);
    return next(new AppError("SomeThing Went wrong", 404));
  }
};

exports.generateqr = async (req, res, next) => {
  try {
    const url = "http://facebook.com";
    console.log("+++++++++", await QRCode.toDataURL("http://facebook.com"));

    QRCode.toString("I am a pony!", { type: "terminal" }, function (err, url) {
      console.log(url);
    });

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log("error", error);
    return next(new AppError("SomeThing Went wrong", 404));
  }
};
