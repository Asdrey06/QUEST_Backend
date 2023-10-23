var express = require("express");
var router = express.Router();

/* GET users listing. */
const User = require("../models/user");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
//route pour la création du compte client le SignUp

router.post("/signUp", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const hash = bcrypt.hashSync(req.body.password, 10);
  // router.post("/signUp", (req, res) => {
  const newUser = new User({
    user_id: req.body.user_id,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    birthday: req.body.birthday,
    addresses: [
      {
        adresses: req.body.addresses,
        city: req.body.city,
        zipcode: req.body.zipcode,
      },
    ],
    photo: req.body.photo,
    username: req.body.username,
    email: req.body.email,
    password: hash,
    cards: [
      {
        date: req.body.date,
        instructions: req.body.instructions,
        servicesafe: req.body.servicesafe,
        goodsfee: req.body.goodsfee,
        total: req.body.total,
        done: req.body.done,
      },
    ],
    token: uid2(32),
  });
  //savegarde du compte client
  newUser.save().then((newDoc) => {
    res.json({ result: true, data: newDoc });
  });
});
// });
module.exports = router;
