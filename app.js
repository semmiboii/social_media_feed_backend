const connectToDB = require('./utils/dbconnect');
const express = require('express');

const Post = require('./schemas/postSchema');
const User = require('./schemas/userSchema');

require('dotenv').config();

const app = require('express');

connectToDB();

app.get('/', (res) => {
    res.send("Hello");
})

app.listen(process.env.BACKEND_PORT || 3001 , () => {
    console.log(`Server running on port ${process.env.BACKEND_PORT ? process.env.BACKEND_PORT : 3001}`);
});
