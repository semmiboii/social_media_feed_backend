const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postId: {type:UUID, default: UUID()},
    userId: {type: UUID},
    private: {type: boolean},
    image: {type: String},
    title: {type: String},
    content: {type: String},
    comments: {type: [String]},
    likes: {type: Number},
    dislikes: {type: Number},
    timestamp: {type: Date, default: Date.now}
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post
