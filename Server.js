const express = require("express");
const app = express();
const mongoose = require("mongoose");
const BlogRoute = require("./Src/Routes/BlogPostRouter");
const AuthRoute = require("./Src/Routes/AuthRouter");
const dotenv = require("dotenv");
dotenv.config({ path: "./Config.env" });
app.use(express.json());
const AppError = require("./Src/Utilis/AppError");
const globelError = require("./src/Controller/errorController");
const socketHandler = require("./Src/Utilis/SoketHandler");
const http = require("http").createServer();
const io = require("socket.io")(http);

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

app.use(cors());
app.use(function (req, res, next) {
  req.io = io;
  next();
});

http.listen(process.env.PORT, "localhost", (res) => {
  try {
    socketHandler(io);
    console.log(`App Running on this  port${process.env.PORT}`);
  } catch (error) {
    console.error(error);
  }
});

process.on("unhandleRejection", (err) => {
  server.close(() => {
    process.exit(1);
  });
});
