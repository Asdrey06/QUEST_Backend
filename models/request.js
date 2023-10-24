const mongoose = require("mongoose");

const requestSchema = mongoose.Schema({
  instruction: String,
  paymentInfo: String,
  date: Date,
  serviceFees: Number,
  productFees: Number,
  totalFees: Number,
});

const Request = mongoose.model("request", requestSchema);

module.exports = Request;
