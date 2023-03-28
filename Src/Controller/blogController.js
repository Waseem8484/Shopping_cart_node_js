const blogpost = require("../Model/BlogModel");
const express = require("express");
const AppError = require("../Utilis/AppError");
const { Query } = require("mongoose");
const app = express();
// express middleware
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
exports.getAllBlog = async (req, res, next) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    if (req.query.page) {
      const numblog = await blogpost.countDocuments();
      console.log("numblog", numblog);
      if (skip >= numblog) {
        return next(new AppError("this page does not exit", 404));
      }
    }

    const blog = await blogpost.find().skip(skip).limit(limit);
    const numblog = await blogpost.countDocuments();
    res.status(200).json({
      status: "success",
      TotalBlogs: numblog,
      pagenumber: page,
      pagesize: blog.length,
      data: {
        Blogsdata: blog,
      },
    });
  } catch (error) {
    console.log("error", error);
    return next(new AppError("SomeThing Went wrong", 404));
  }
};

// post api methed

exports.createBlog = async (req, res, next) => {
  try {
    const { title, content, auther } = req.body;
    if (!title) {
      return next(new AppError("Please Enter title", 404));
    }
    if (!content) {
      return next(new AppError("Please Enter content", 404));
    }
    if (!auther) {
      return next(new AppError("Please Enter auther", 404));
    }
    const blog = await blogpost.create(req.body);
    const savePost = await blog.save();
    res.status(201).json({
      status: "success",
      data: {
        blogs: savePost,
      },
    });
  } catch (error) {
    console.log("errr", error);
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
    if (error.name === "CastError") {
      return next(
        new AppError("you does not enter correct blogid please check it", 404)
      );
    }
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
    if (error.name === "CastError") {
      return next(
        new AppError("you does not enter correct blogid please check it", 404)
      );
    }
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
    console.log(error.name);
    if (error.name === "CastError") {
      return next(
        new AppError("you does not enter correct blogid please check it", 404)
      );
    }
    return next(new AppError("SomeThing Went wrong", 404));
  }
};
