const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  date: Date,
  firstname: String,
  message: String,
});

const finishedRequestSchema = mongoose.Schema({
  instruction: { type: String },
  paymentInfo: { type: String },
  date: { type: Date, default: Date.now },
  serviceFees: { type: Number },
  productFees: { type: Number },
  totalFees: { type: Number },
  from: String,
  fromConcierge: String,
  photoConcierge: String,
  conciergeId: String,
  clientToken: String,
  chat: [chatSchema],
  pastRequestId: String,
  done: Boolean,
});

const FinishedRequest = mongoose.model(
  "finishedRequests",
  finishedRequestSchema
);

module.exports = FinishedRequest;
