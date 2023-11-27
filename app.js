var connectToDB = require("./utils/dbconnect");
var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");

const Post = require("./models/postSchema");
const User = require("./models/userSchema");
const Comment = require("./models/commentSchema");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

connectToDB();

// Post REST APIs

app.get("/posts", async (req, res) => {
  const allPosts = await Post.find({});
  res.send(allPosts);
});

app.post("/post/new", async (req, res) => {
  try {
    const post = req.body;

    const newPost = new Post({
      userId: post.userId,
      author: post.author,
      title: post.title,
      description: post.description,
      comments: post.comments,
    });

    const data = await newPost.save();

    if (data) {
      res.send(data);
    }
  } catch (error) {
    2;
    res.status(404).send({ error: error.message });
  }
});

app.get("/post/:userId", async (req, res) => {
  try {
    const userPosts = await Post.find({ userId: req.params.userId });
    if (userPosts) {
      res.status(200).send(userPosts);
    } else {
      res.status(404).send({ message: "POSTS_NOT_FOUND" });
    }
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
});

app.get("/post/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (post) {
      res.send(post);
    }
  } catch (error) {
    res.status(404).send("Something went wrong");
  }
});

app.get("/post/:postId/likes", async (req, res) => {
  try {
    const existingPost = await Post.findById(req.params.postId);
    const likesCount = existingPost.likes.length;

    res.status(200).send({ likeCount: likesCount });
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
});

app.post("/post/:postId", async (req, res) => {
  try {
    const paramsPostId = req.params.postId;
    const body = await req.body;

    const newComment = new Comment({
      postId: paramsPostId,
      userId: body.userId,
      author: body.author,
      comment: body.comment,
    });

    const data = await newComment.save();

    if (data) {
      res.status(200).send(data);
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

app.patch("/post/:userId/:postId", async (req, res) => {
  try {
    const existingPost = await Post.findById(req.params.postId);

    if (!existingPost) {
      return res.status(404).send({ message: "Post Not Found" });
    }

    existingPost.like = !existingPost.like;

    const userIdIndex = existingPost.likes.indexOf(req.params.userId);

    if (userIdIndex === -1) {
      existingPost.likes.push(req.params.userId);
    } else {
      existingPost.likes.splice(userIdIndex, 1);
    }

    const updatedPost = await existingPost.save();

    if (updatedPost) {
      res.send({ message: "SUCCESS" });
    } else {
      res.status(500).send({ message: "Failed To Update Post" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Comment REST APIs

app.get("/:postId/comments", async (req, res) => {
  try {
    const postComments = await Comment.find({ postId: req.params.postId });
    if (postComments) {
      res.status(200).send(postComments);
    }
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
});

// User REST APIs
app.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).exec();
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ error: "USER_NOT_FOUND" });
    }
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

app.post("/user", async (req, res) => {
  try {
    const userInfo = req.body;

    const user = await User.findOne({
      email: userInfo.email,
    }).exec();

    if (user.password === userInfo.password) {
      res.status(200).send({ userId: user._id, userName: user.name });
    } else {
      res.status(404).send({ error: error.message });
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

app.post("/user/new", async (req, res) => {
  try {
    const userInfo = await req.body;

    const userExists = await User.findOne({
      username: userInfo.username,
      email: userInfo.email,
      password: userInfo.password,
    }).exec();

    if (!userExists) {
      const newUser = new User({
        username: userInfo.username,
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
      });

      const data = await newUser.save();
      res.send(data);
    } else {
      res.status(404).send({ error: "USER_ALREADY_EXISTS" });
    }
  } catch (err) {
    res.status({ message: err.message });
  }
});

app.listen(process.env.BACKEND_PORT || 3001, () => {
  console.log(
    `Server running on port ${
      process.env.BACKEND_PORT ? process.env.BACKEND_PORT : 3001
    }`
  );
});
