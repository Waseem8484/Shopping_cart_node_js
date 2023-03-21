const express = require("express");
const app = express();
const mongoose = require("mongoose");
const BlogRoute = require("./Src/Routes/BlogPostRouter");
const AuthRoute = require("./Src/Routes/AuthRouter");
const dotenv = require("dotenv");
dotenv.config({ path: "./Config.env" });
app.use(express.json());
const AppError = require("./Src/Utilis/AppError");
const globelError = require("./Src/Controller/errorController");
mongoose
  .connect(process.env.data_base, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("successful connected___________");
  })
  .catch((err) => {
    console.log("errrr++++++++++", err);
  });
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(BlogRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globelError);
const server = app.listen(process.env.port, "127.0.0.1", (res) => {
  console.log(`App Running on this  port`);
});

process.on("unhandleRejection", (err) => {
  console.log(err.name, err.message);
  console.log("unhandled error rejection down");
  server.close(() => {
    process.exit(1);
  });
});
