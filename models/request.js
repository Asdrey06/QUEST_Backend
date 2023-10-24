const mongoose = require("mongoose");

const requestSchema = mongoose.Schema({
  instruction: String,
  paymentInfo: String,
  date: { type: Date, default: Date.now },
  serviceFees: { type: Number, required: true },
  productFees: { type: Number, required: true },
  totalFees: { type: Number, required: true },
});

const Request = mongoose.model("request", requestSchema);

module.exports = Request;
