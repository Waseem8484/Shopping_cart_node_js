const message = require("../Model/MessageModel");
const express = require("express");
const AppError = require("../Utilis/AppError");
const socketio = require("socket.io");
const io = require("socket.io");
const sockets = io();
const app = express();
app.use(express.json());

const {
  addUser,
  getUser,
  removeUser,
} = require("./../../Src/Utilis/WebSocket");
const Room = require("./../Model/RoomModel");

exports.getmessages = async (req, res, next) => {
  try {
    const messages = await message.find();

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
    sockets.emit("messagespost", req.body);
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
