var connectToDB = require("./utils/dbconnect");
var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");

const Post = require("./models/postSchema");
const User = require("./models/userSchema");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

connectToDB();

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

    const pushPost = await User.findByIdAndUpdate(post.userId, {
      $push: { posts: newPost },
    });

    if (data && pushPost) {
      res.send(data);
    }
  } catch (error) {
    2;
    res.status(404).send({ error: error.message });
  }
});

app.post("/user", async (req, res) => {
  try {
    const userInfo = req.body;
    const user = await User.findOne({
      email: userInfo.email,
      password: userInfo.password,
    }).exec();

    if (user) {
      res.send({ userId: user._id, userName: user.name });
    } else {
      res.send({ error: "USER_NOT_FOUND" });
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

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
    res.send(err);
  }
});

app.listen(process.env.BACKEND_PORT || 3001, () => {
  console.log(
    `Server running on port ${
      process.env.BACKEND_PORT ? process.env.BACKEND_PORT : 3001
    }`
  );
});
