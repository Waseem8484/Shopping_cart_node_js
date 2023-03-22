const mongoose = require("mongoose");
const AppError = require("../Utilis/AppError");
var validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const Bloguserschema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please Provide Valid email"],
    unique: true,
    lowercase: true,
    trim: true,

    validate: validateEmail,
  },
  password: {
    type: String,
    required: [true, "please provide a valid Password"],
    minLength: 6,
    select: false,
  },
});

async function validateEmail(email) {
  if (!validator.isEmail(email))
    return new AppError("Please enter a valid email address.");
  const user = await blogUsers.findOne({ email });
  if (user)
    return new AppError(
      "A user is already registered with this email address."
    );
}
Bloguserschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
Bloguserschema.methods.correctPassword = async function (
  passwordToMatch,
  password
) {
  return await bcrypt.compare(passwordToMatch, password);
};
const blogUsers = mongoose.model("BlogUsers", Bloguserschema);
module.exports = blogUsers;
