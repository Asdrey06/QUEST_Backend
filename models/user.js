const mongoose = require('mongoose');

const addressShema = mongoose.Schema({
  adress: String,
  city: String,
  zipcode: Number,
});

const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  birthday: Date,
  addresses: [addressShema],
  photo: String,
  username: String,
  email: String,
  password: String,
  cards: [String],
  token: String
});

const User = mongoose.model('users', userSchema);

module.exports = User;