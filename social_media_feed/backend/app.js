const connectToDB = require("./utils/dbconnect");
const express = require("express");
const mongoose = require("mongoose");
const ImageKit = require("imagekit");

const Post = require("./schemas/postSchema");
const User = require("./schemas/userSchema");

require("dotenv").config();

const app = express();

const imageKit = new ImageKit({
  urlEndpoint: process.env.IMGKIT_URLENDPOINT,
  publicKey: process.env.IMGKIT_PUBLICKEY,
  privateKey: process.env.IMGKIT_PRIVATEKEY,
});

connectToDB();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/feed", (req, res) => {
  const allPosts = Post.find({});
  res.send(allPosts);
});

app.post("/new/post", (req, res) => {
  const post = req.body;

  const newPost = new Post(post);
  newPost.save();

  res.send("Added New Post Succesfully");
});

// app.get("/user/:usermail", (req, res) => {
//   const mail = req.params.usermail;
//   const user = User.findOne({ mail: mail });

//   res.send(user);
// });

// app.post("/user/new", (req, res) => {
//   const userInfo = req.body;
//   const newUser = new User(userInfo);

//   newUser.save();
// });

app.listen(process.env.BACKEND_PORT || 3001, () => {
  console.log(
    `Server running on port ${
      process.env.BACKEND_PORT ? process.env.BACKEND_PORT : 3001
    }`
  );
});
