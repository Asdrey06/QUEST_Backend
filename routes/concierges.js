var express = require("express");
var router = express.Router();
const Concierge = require("../models/concierge");
const Request = require("../models/request");
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");

//route pour recuperer la liste de concierge
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

//Function to validate password
function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  return passwordRegex.test(password);
}

// The route allows me to connect to my concierge account
router.post("/signinConcierge", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Champs vides ou manquants" });
    return;
  }
  const { email, password } = req.body;
  if (!validateEmail(email)) {
    res.json({ result: false, error: "Adresse e-mail invalide" });
    return;
  }
  // Route pour se connecter à son compte concierge
  Concierge.findOne({ email: email }).then((data) => {
    if (data && bcrypt.compareSync(password, data.password)) {
      res.json({ result: true, token: data.token, data: data });
    } else {
      res.json({
        result: false,
        error: "Compte non trouvé ou mot de passe invalide",
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
      "phoneNumber",
      "skills",
      "languages",
      "aboutme",
      "transport",
      "documents",
      "status",
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
  // Route pour récuprer son email dans la BDD
  Concierge.findOne({ email: req.body.email }).then((data) => {
    if (data) {
      console.log("Utilisateur déjà existant");
      res.json({ result: false, error: "E-mail déjà existant" });
      // if (data)
      return;
    }
    // Route pour récuprer son usernamme dans la BDD
    Concierge.findOne({ username: req.body.username }).then((data) => {
      if (data) {
        console.log("Utilisateur déjà existant");
        res.json({ result: false, error: "Utilisateur déjà existant" });
        // if (data)
      } else if (req.body.birthday.split("-")[0] > 2006) {
        console.log("Mineur!!!");
        res.json({ result: false, error: "Âge minimum 18 ans" });
        // if (data)
      } else {
        const hash = bcrypt.hashSync(req.body.password, 10);

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
          paymentInfo: req.body.paymentInfo,
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
          token: uid2(32),
          status: req.body.status,
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
});
//Route pour récupérer la requete du client et l'afficher sur la dashboard concierge
router.post("/findRequests", (req, res) => {
  Concierge.findOne({ token: req.body.token })
    .then((concierge) => {
      if (!concierge) {
        res.json({ result: [] });
      } else {
        const requestIds = concierge.requests;

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
// route pour recuperer les infos du conierge
router.post("/findInfo", (req, res) => {
  Request.findOne({ _id: req.body.id }).then((data) => {
    Concierge.findOne({ _id: data.conciergeId })
      .then((concierge) => {
        if (!concierge) {
          res.json({ result: "Concierge profile not found" });
        } else {
          res.json({ result: concierge, request: data });
        }
      })
      .catch((error) => {
        console.error("An error occurred: ", error);
        res.status(500).json({ error: "An error occurred" });
      });
  });
});

router.post("/findInfoProfile", (req, res) => {
  Concierge.findOne({ _id: req.body.id })
    .then((concierge) => {
      if (!concierge) {
        res.json({ result: "Concierge profile not found" });
      } else {
        res.json({ result: concierge });
      }
    })
    .catch((error) => {
      console.error("An error occurred: ", error);
      res.status(500).json({ error: "An error occurred" });
    });
});

router.post("/findInfoDashboardConcierge", (req, res) => {
  Concierge.findOne({ token: req.body.token })
    .then((concierge) => {
      console.log("huh", concierge);
      if (!concierge) {
        res.json({ result: "Concierge profile not found" });
      } else {
        res.json({ result: concierge });
      }
    })
    .catch((error) => {
      console.error("An error occurred: ", error);
      res.status(500).json({ error: "An error occurred" });
    });
});

router.post("/leaveReview", (req, res) => {
  Concierge.updateOne(
    { _id: req.body.id },
    { $push: { reviews: req.body.review } }
  ).then((data) => {
    res.json({ result: true });
  });
});

// Route pour recuperer les détails du concierge
router.post("/findInfoToken", (req, res) => {
  Concierge.findOne({ token: req.body.token })
    .then((concierge) => {
      if (!concierge) {
        res.json({ result: "Concierge profile not found" });
      } else {
        res.json({ result: concierge });
      }
    })
    .catch((error) => {
      console.error("An error occurred: ", error);
      res.status(500).json({ error: "An error occurred" });
    });
});

//Route pour mettre a jour l'e-mail concierge
router.post("/updateConcierge", (req, res) => {
  const { email } = req.body;
  if (!validateEmail(email)) {
    res.json({ result: false, error: "Adresse e-mail invalide" });
    return;
  }
  Concierge.updateOne({ token: req.body.token }, { email: req.body.email })
    .then((data) => {
      res.json({ result: true });
    })
    .catch((error) => {
      console.error("An error occured: ", error);
      res.status(500).json({ error: "An error occured " });
    });
});

//Route qui permet de modifier et crypter le mot de passe concierge
router.post("/updatePasswordConcierge", (req, res) => {
  const { password } = req.body;
  if (!validatePassword(password)) {
    res.json({
      result: false,
      error:
        "Format du mot de passe incorrect (Première lettre majusucule, 8 caractères et un symbole requis)",
    });
    return;
  }
  const hash = bcrypt.hashSync(req.body.password, 10);
  Concierge.updateOne({ token: req.body.token }, { password: hash })
    .then((data) => {
      res.json({ result: true });
    })
    .catch((error) => {
      console.error("An error occured: ", error);
      res.status(500).json({ error: "An error occured " });
    });
});
//Route qui permet de modifier l'adresse concierge
router.post("/updateAddressConcierge", (req, res) => {
  Concierge.updateOne(
    { token: req.body.token },
    { addresses: [req.body.address] }
  )
    .then((data) => {
      res.json({ result: true });
    })
    .catch((error) => {
      console.error("An error occured: ", error);
      res.status(500).json({ error: "An error occured " });
    });
});

//Route qui permet de modifier l'aboutme concierge
router.post("/updateAboutMeConcierge", (req, res) => {
  Concierge.updateOne(
    { token: req.body.token },
    { personalInfo: [req.body.aboutme] }
  )
    .then((data) => {
      res.json({ result: true });
    })
    .catch((error) => {
      console.error("An error occured: ", error);
      res.status(500).json({ error: "An error occured " });
    });
});

//Route qui permet de modifier l'iban concierge
router.post("/updateIbanConcierge", (req, res) => {
  Concierge.updateOne(
    { token: req.body.token },
    { paymentInfo: req.body.paymentInfo }
  )
    .then((data) => {
      res.json({ result: true });
    })
    .catch((error) => {
      console.error("An error occured: ", error);
      res.status(500).json({ error: "An error occured " });
    });
});

module.exports = router;
