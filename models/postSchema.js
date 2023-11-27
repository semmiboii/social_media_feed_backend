const mongoose = require("mongoose");
const { commentSchema } = require("./commentSchema");

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  author: { type: String, requried: true },
  private: { type: Boolean, default: false },
  title: { type: String },
  description: { type: String },
  like: { type: Boolean, default: false },
  likes: { type: [mongoose.Types.ObjectId], ref: "User" },
  timestamp: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
module.exports.postSchema = postSchema;
