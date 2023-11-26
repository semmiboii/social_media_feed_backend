const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId },
  userId: { type: mongoose.Schema.Types.ObjectId },
  private: { type: Boolean },
  image: { type: String },
  title: { type: String },
  content: { type: String },
  comments: { type: [String] },
  like: { type: Boolean },
  timestamp: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
module.exports.postSchema = postSchema;
