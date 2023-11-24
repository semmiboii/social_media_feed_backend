const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: UUID, default: UUID()},
    username: { first: {type: String, require: true}, last: {type: String} },
    name: {type: String, requrired: true},
    age: {type: Number, default: 0},
    image: {type: String},
    password: {type: String},
    posts: {type: [ { id: UUID, title: String, image: String, content: String, comments:[String], timestamp: Date } ]}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
