const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  firstname: String,
  message: String,
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
