const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  author: { type: String, requried: true },
  private: { type: Boolean, default: false },
  title: { type: String },
  description: { type: String },
  comments: { type: [String] },
  like: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
module.exports.postSchema = postSchema;
