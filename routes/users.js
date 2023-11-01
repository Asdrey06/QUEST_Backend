var express = require("express");
var router = express.Router();
const User = require("../models/user");
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
const Request = require("../models/request");

// Function to validate email
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}
// function validatePassword(password) {
//   const passwordRegex =
//     /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
//   return passwordRegex.test(password);
// }

//Function to validate password
function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  return passwordRegex.test(password);
}
// The route allows me to connect to my customer account
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Champs vide ou manquants" });
    return;
  }
  const { email, password } = req.body;
  if (!validateEmail(email)) {
    res.json({ result: false, error: "Adresse e-mail invalide" });
    return;
  }
  User.findOne({ email: email }).then((data) => {
    if (data && bcrypt.compareSync(password, data.password)) {
      res.json({ result: true, token: data.token, data: data });
    } else {
      res.json({ result: false, error: "E-mail ou mot de passe éronné" });
    }
  });
});

//route pour la création du compte client le SignUp
router.post("/signUp", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Champs vides ou manquants" });
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

  User.findOne({ email: req.body.email }).then((data) => {
    if (req.body.birthday.split("-")[0] > 2006) {
      console.log("Mineur!!!");
      res.json({ result: false, error: "Âge minimum 18 ans" });
    } else {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        birthday: new Date(req.body.birthday),
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
        token: uid2(32),
        status: "client",
      });
      //sauvegarde du compte client
      newUser
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
// Route pour modifier le client
router.post("/updateUsers", (req, res) => {
  User.updateOne({ __id: req.body.id }, req.body)
    .then((data) => {
      res.json({ result: data });
    })
    .catch((error) => {
      console.error("An error occured:", error);
      res.status(500).json({ error: "An error occured" });
    });
});

// Route pour récupérer et afficher les infos du client
router.post("/findRequests", (req, res) => {
  User.findOne({ token: req.body.token })
    .then((client) => {
      if (!client) {
        res.json({ result: [] });
      } else {
        const requestIds = client.requests;

        Request.find({ _id: { $in: requestIds } })
          .then((requests) => {
            res.json({ result: requests });
          })
          .catch((error) => {
            console.error("An error occurred: ", error);
            res.status(500).json({ error: "An error occurred" });
          });
      }
    })
    .catch((error) => {
      console.error("An error occurred: ", error);
      res.status(500).json({ error: "An error occurred" });
    });
});

//Route pour récupérer les infos du client
router.post("/findUserInfo", (req, res) => {
  User.findOne({ token: req.body.token })
    .then((data) => {
      res.json({ result: data });
    })
    .catch((error) => {
      console.error("An error occured:", error);
      res.status(500).json({ error: "An error occured" });
    });
});

// Route pour modifier l'Email.
router.post("/updateMail", (req, res) => {
  User.updateOne(
    {
      _id: req.body.id,
    },
    { email: req.body.email }
  ).then((data) => {
    console.log(data);
    res.json({ result: "E-mail mis à jour" });
  });
});

// Route pour modifier le mot de passe et hasher le nouveau mot de passe.
router.post("/updatePasswords", (req, res) => {
  const { password } = req.body;
  if (!validatePassword(password)) {
    res.json({
      result: false,
      error:
        "Format du mot de passe incorrect (Première lettre majuscule, 8 caractères et un symbole requis",
    });
    return;
  }
  const hash = bcrypt.hashSync(req.body.password, 10);
  User.updateOne({ _id: req.body.id }, { password: hash })
    .then((data) => {
      res.json({ result: true });
    })
    .catch((error) => {
      console.error("An error occured:", error);
      res.status(500).json({ error: "An error occured" });
    });
});

module.exports = router;
