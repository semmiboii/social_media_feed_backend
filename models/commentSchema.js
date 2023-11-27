const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  postId: { type: mongoose.Types.ObjectId, ref: "Post" },
  comment: { type: String, required: true },
  author: { type: String },
  timestamp: { type: Date, default: Date.now() },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
module.exports.commentSchema = commentSchema;
