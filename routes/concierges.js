var express = require("express");
var router = express.Router();
const Concierge = require("../models/concierge");
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");

router.get("/conciergeList", (req, res) => {
  Concierge.find().then((data) => {
    res.json({ result: data });
  });
});

// Function to validate email
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

//
function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  return passwordRegex.test(password);
}

// The route allows me to connect to my concierge account
router.post("/signinConcierge", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Champs vide ou manquants" });
    return;
  }
  const { email, password } = req.body;
  if (!validateEmail(email)) {
    res.json({ result: false, error: "Adresse e-mail invalide" });
    return;
  }
  Concierge.findOne({ email: email }).then((data) => {
    if (data && bcrypt.compareSync(password, data.password)) {
      res.json({ result: true, token: data.token, data: data });
    } else {
      res.json({
        result: false,
        error: "Compte non trouvé ou mot de passe invalide",
      });
      res.json({
        result: false,
        error: "Concierge not found or wrong password",
      });
    }
  });
});

//route pour la création du compte concierge
router.post("/signupConcierge", (req, res) => {
  if (
    !checkBody(req.body, [
      "firstname",
      "lastname",
      "birthday",
      "address",
      "city",
      "zipcode",
      "username",
      "email",
      "password",
      "paymentInfo",
      "nationality",
      "phoneNumber",
      "skills",
      "languages",
      "aboutme",
      "transport",
      "documents",
    ])
  ) {
    res.json({ result: false, error: "Champs vide ou manquants" });
    return;
  }
  const { email } = req.body;
  if (!validateEmail(email)) {
    res.json({ result: false, error: "Adresse e-mail invalide" });
    return;
  }

  const { password } = req.body;
  if (!validatePassword(password)) {
    res.json({
      result: false,
      error:
        "Format du mot de passe incorrect (Première lettre majusucule, 8 caractères et un symbole requis)",
    });
    return;
  }

  Concierge.findOne({ email: req.body.email }).then((data) => {
    if (data) {
      console.log("Utilisateur déjà existant");
      // You might want to send a response here indicating that the email is already in use.
      res.json({ result: false, message: "E-mail déjà existant" });
    } else {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const hashIban = bcrypt.hashSync(req.body.paymentInfo, 10);
      const newConcierge = new Concierge({
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
        paymentInfo: hashIban,
        nationality: req.body.nationality,
        phoneNumber: req.body.phoneNumber,
        personalInfo: [
          {
            skills: [req.body.skills],
            languages: [req.body.languages],
            aboutme: req.body.aboutme,
            transport: [req.body.transport],
            documents: req.body.documents,
          },
        ],
        reviews: [
          {
            stars: req.body.stars,
            review: req.body.review,
          },
        ],
        token: uid2(32),
      });
      newConcierge
        .save()
        .then((newDoc) => {
          res.json({ result: true, token: newDoc.token, data: newDoc });
        })
        .catch((error) => {
          res.json({ result: false, error: error });
        });
    }
  });
});
module.exports = router;
