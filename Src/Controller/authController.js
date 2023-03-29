const blogUsers = require("./../Model/AuthModel");
const express = require("express");
const AppError = require("../Utilis/AppError");
const { promisify } = require("util");
const app = express();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { use } = require("../Routes/BlogPostRouter");
dotenv.config({ path: "./Config.env" });

// express middleware
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
const signInToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRY,
  });
};

exports.singUp = async (req, res, next) => {
  try {
    const blog = await blogUsers.create(req.body);
    const savePost = await blog.save();

    const { password, email } = req.body;
    if (!email) {
      return next(new AppError("Please Enter Email", 404));
    }
    if (!password) {
      return next(new AppError("Please Enter Password", 404));
    }
    res.status(201).json({
      status: "Success",
      data: {
        user: savePost,
      },
    });
  } catch (error) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      return next(new AppError("User Already exist", 422));
    }
    if (error.name === "ValidationError") {
      return next(
        new AppError("email or password is not formated please check it", 404)
      );
    }

    return next(new AppError("SomeThing went wrong", 404));
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    // if check email and password is exit
    if (!email) {
      return next(new AppError("Please Enter Email", 404));
    }
    if (!password) {
      return next(new AppError("Please Enter Password", 404));
    }
    //check if user exists && password is correct
    const user = await blogUsers.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("User does not exit", 401));
    }
    if (!(await user.correctPassword(password, user.password))) {
      return next(new AppError("Please Enter correct password", 404));
    }
    // if every thing ok send token to the client
    const token = signInToken(user._id);
    console.log(token);
    res.status(200).json({
      status: "Success",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    console.log("345566", error);
    return next(new AppError("SomeThing went wrong", 404));
  }
};

exports.Protect = async (req, res, next) => {
  try {
    let tokens;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      tokens = req.headers.authorization.split(" ")[1];
    }
    if (!tokens) {
      return next(
        new AppError(
          "You are not logged in! Please Log in  to give access",
          404
        )
      );
    }
    // veryfy token
    let decoded = jwt.verify(tokens, process.env.TOKEN_SECRET_KEY);

    const FreshUser = await blogUsers.findById(decoded.id);
    if (!FreshUser) {
      return next(new AppError("user still not exit", 404));
    }
    next();
  } catch (error) {
    console.log(error);
    next();
  }
};
