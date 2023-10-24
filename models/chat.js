const mongoose = require("mongoose");


const chatSchema = mongoose.Schema({
date: String,
firstname: String,
username: String,
message: String,
});

const Chat = mongoose.model("chat", chatSchema);

module.exports = Chat;