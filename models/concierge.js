const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  address: String,
  city: String,
  zipcode: Number,
});

const starsSchema = mongoose.Schema({
    stars: Number,
    review: String,
});

const InfoSchema = mongoose.Schema({
    skills: [String],
    languages: [String],
    aboutme: String,
    transport: [String],
    documents: [String],
});

const conciergeSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  birthday: Date,
  addresses: [addressSchema],
  photo: String,
  username: String,
  email: String,
  password: String,
  paymentInfo: String,
  nationality: String,
  phoneNumber: String,
  personalInfo: [InfoSchema],
  reviews: [starsSchema],
  token: String,
});

const Concierge = mongoose.model("concierge", conciergeSchema);

module.exports = Concierge;