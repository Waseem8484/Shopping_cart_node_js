const blogpost = require("../Model/BlogModel");
const express = require("express");
const AppError = require("../Utilis/AppError");
const app = express();
// express middleware
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
exports.getAllBlog = async (req, res, next) => {
  try {
    const blog = await blogpost.find(req.query);
    res.status(200).json({
      status: "success",
      TotalBlogs: blog.length,
      data: {
        Blogsdata: blog,
      },
    });
  } catch (error) {
    return next(new AppError("SomeThing Went wrong", 404));
  }
};

// post api methed

exports.createBlog = async (req, res, next) => {
  try {
    const blog = await blogpost.create(req.body);
    const savePost = await blog.save();
    res.status(201).json({
      status: "success",
      data: {
        blogs: savePost,
      },
    });
  } catch (error) {
    return next(new AppError("SomeThing Went wrong", 404));
  }
};

// get api by id methed
exports.getoneBlog = async (req, res, next) => {
  try {
    const blog = await blogpost.findById(req.params.id);
    if (!blog) {
      return next(
        new AppError("No Blog Found With This ID Please Enter correct ID", 404)
      );
    }
    res.status(200).json({
      status: "success",
      data: {
        blog,
      },
    });
  } catch (error) {
    console.log(error.name);
    return next(new AppError("SomeThing Went wrong", 404));
  }
};

// deleteApi Methd

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await blogpost.findByIdAndDelete(req?.params?.id);
    if (!blog) {
      return next(
        new AppError("No Blog Found With This ID Please Enter correct ID", 404)
      );
    }
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError("SomeThing Went wrong", 404));
  }
};

// Patch Api methed
exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await blogpost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!blog) {
      return next(
        new AppError("No Blog Found With This ID Please Enter correct ID", 404)
      );
    }
    res.status(200).json({
      status: "success",
      data: {
        blog,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new AppError("SomeThing Went wrong", 404));
  }
};
