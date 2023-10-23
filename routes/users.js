var express = require("express");
var router = express.Router();
const User = require("../models/user");
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");

// Function to validate email
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

// The route allows me to connect to my customer account
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const { email, password } = req.body;
  if (!validateEmail(email)) {
    res.json({ result: false, error: "Invalid email address" });
    return;
  }
  User.findOne({ email: email }).then((data) => {
    if (data && bcrypt.compareSync(password, data.password)) {
      res.json({ result: true, token: data.token, data: data });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

//route pour la création du compte client le SignUp
router.post("/signUp", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const { email } = req.body;
  if (!validateEmail(email)) {
    res.json({ result: false, error: "Invalid email address" });
    return;
  }
  User.findOne({ email: req.body.email }).then((data) => {
    //Jif (data === null) {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      birthday: req.body.birthday,
      addresses: [
        {
          address: req.body.address,
          city: req.body.city,
          zipcode: req.body.zipcode,
        },
      ],
      photo: req.body.photo,
      username: req.body.username,
      email: req.body.email,
      password: hash,
      cards: [req.body.cards],
      token: uid2(32),
    });
    //savegarde du compte client
    newUser
      .save()
      .then((newDoc) => {
        res.json({ result: true, token: data.token, data: newDoc });
      })
      .catch((error) => {
        res.json({ result: false, error: "User already exist" });
      });
    //}
  });
});
// });
module.exports = router;
