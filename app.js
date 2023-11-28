const connectToDB = require("./utils/dbconnect");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

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

app.get("/post/:postId/:userId/like", async (req, res) => {
  try {
    const existingPost = await Post.findById(req.params.postId);

    if (!existingPost) {
      return res.status(404).send({ message: "Post Not Found" });
    }

    if (existingPost.likes.includes(req.params.userId)) {
      res.status(200).send(true);
    } else {
      res.status(200).send(false);
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.get("/post/:postId/likes", async (req, res) => {
  try {
    const existingPost = await Post.findById(req.params.postId);

    if (!existingPost) {
      return res.status(404).send({ message: "Post Not Found" });
    }

    const likesCount = existingPost.likes.length;

    res.status(200).send({ likeCount: likesCount });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.patch("/post/:userId/:postId", async (req, res) => {
  try {
    const existingPost = await Post.findById(req.params.postId);

    if (!existingPost) {
      return res.status(404).send({ message: "Post Not Found" });
    }

    const userId = req.params.userId;

    const userLiked = existingPost.likes.includes(userId);
    const userLikedIndex = existingPost.likes.indexOf(userId);

    if (!userLiked) {
      existingPost.likes.push(userId);
    } else {
      existingPost.likes.splice(userLikedIndex, 1);
    }

    const updatedPost = await existingPost.save();

    if (updatedPost) {
      res.send({ message: "SUCCESS", updatedPost });
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

app.post("/post/:postId", async (req, res) => {
  try {
    const paramsPostId = req.params.postId;
    const body = req.body;

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

app.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email }).exec();

    if (!userExists) {
      return res.status(401).send({ error: "INVALID_CREDENTIALS" });
    }

    const isPasswordValid = bcrypt.compare(password, userExists.password);

    if (!isPasswordValid) {
      return res.status(401).send({ error: "INVALID_CREDENTIALS" });
    }

    res.status(200).send({ userId: userExists._id, userName: userExists.name });
  } catch (error) {
    res.status(500).send({ error: "INTERNAL_SERVER_ERROR" });
  }
});

app.post("/user/new", async (req, res) => {
  try {
    const userInfo = req.body;

    const hashedPassword = await bcrypt.hash(
      userInfo.password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS)
    );

    const userExists = await User.findOne({
      $or: [{ username: userInfo.username }, { email: userInfo.email }],
    }).exec();

    if (userExists) {
      return res.status(409).send({ error: "USER_ALREADY_EXISTS" });
    }

    const newUser = new User({
      username: userInfo.username,
      name: userInfo.name,
      email: userInfo.email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).send(savedUser);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(process.env.BACKEND_PORT || 3001, () => {
  console.log(
    `Server running on port ${
      process.env.BACKEND_PORT ? process.env.BACKEND_PORT : 3001
    }`
  );
});
