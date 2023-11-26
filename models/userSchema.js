const mongoose = require("mongoose");
const { postSchema } = require("./postSchema");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  name: { type: String,  unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  posts: { type: [postSchema] },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
module.exports.userSchema = userSchema;
