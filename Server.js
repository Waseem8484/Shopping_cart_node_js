const express = require("express");
const app = express();
const mongoose = require("mongoose");
const BlogRoute = require("./Src/Routes/BlogPostRouter");
const AuthRoute = require("./Src/Routes/AuthRouter");
const dotenv = require("dotenv");
dotenv.config({ path: "./Config.env" });
app.use(express.json());
const AppError = require("./Src/Utilis/AppError");
const WebSockets = require("./Src/Utilis/WebSocket");
const globelError = require("./Src/Controller/errorController");
const http = require("http").createServer(app);
const { addUser, getUser, removeUser } = require("./Src/Utilis/WebSocket");
const Room = require("./Src/Model/RoomModel");
const message = require("./Src/Model/MessageModel");
const socketio = require("socket.io");
const io = socketio(http);
const cors = require("cors");
mongoose
  .connect(process.env.DATA_BASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("successful connected___________");
  })
  .catch((err) => {
    console.log("errrr++++++++++", err);
  });

// io.on("connection", WebSocke
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use("/", AuthRoute);
app.use("/", BlogRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globelError);

exports.sockets = io.on("connection", (socket) => {
  console.log(socket.id);
  Room.find().then((result) => {
    socket.emit("output-rooms", result);
  });
  socket.on("create-room", (name) => {
    const room = new Room({ name });
    room.save().then((result) => {
      io.emit("room-created", result);
    });
  });
  socket.on("join", ({ name, room_id, user_id }) => {
    const { error, user } = addUser({
      socket_id: socket.id,
      name,
      room_id,
      user_id,
    });
    socket.join(room_id);
    if (error) {
      console.log("join error", error);
    } else {
      console.log("join user", user);
    }
  });
  socket.on("sendMessage", (message, room_id, callback) => {
    const user = getUser(socket.id);
    const msgToStore = {
      name: user.name,
      user_id: user.user_id,
      room_id,
      text: message,
    };
    console.log("message", msgToStore);
    const msg = new message(msgToStore);
    msg.save().then((result) => {
      io.to(room_id).emit("message", result);
      callback();
    });
  });
  socket.on("get-messages-history", (room_id) => {
    message.find({ room_id }).then((result) => {
      socket.emit("output-messages", result);
    });
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
  });
});
const server = http.listen(process.env.PORT, "localhost", (res) => {
  console.log(`App Running on this  port${process.env.PORT}`);
});

process.on("unhandleRejection", (err) => {
  server.close(() => {
    process.exit(1);
  });
});
