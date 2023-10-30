const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  date: Date,
  firstname: String,
  message: String,
});

const requestSchema = mongoose.Schema({
  instruction: { type: String },
  paymentInfo: { type: String },
  date: { type: Date, default: Date.now },
  serviceFees: { type: Number },
  productFees: { type: Number },
  totalFees: { type: Number },
  from: String,
  fromConcierge: String,
  photoConcierge: String,
  chat: [chatSchema],
});

const Request = mongoose.model("requests", requestSchema);

module.exports = Request;
