const mongoose = require("mongoose");

const requestSchema = mongoose.Schema({
  instruction: { type: String },
  paymentInfo: { type: String },
  date: { type: Date, default: Date.now },
  serviceFees: { type: Number },
  productFees: { type: Number },
  totalFees: { type: Number },
});

const Request = mongoose.model("requests", requestSchema);

module.exports = Request;
