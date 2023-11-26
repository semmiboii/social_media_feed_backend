const mongoose = require("mongoose");
const { postSchema } = require("./postSchema");

const userSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  username: { type: String, required: true },
  name: { type: String, requrired: true },
  mail: { type: String, required: true },
  password: { type: String },
  userImg: { type: String },
  posts: { type: [postSchema] },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
module.exports.userSchema = userSchema;
