const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  author: { type: String, requried: true },
  title: { type: String },
  description: { type: String },
  likes: { type: [mongoose.Types.ObjectId], ref: "User" },
  timestamp: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
module.exports.postSchema = postSchema;
