var express = require("express");
var router = express.Router();
const Request = require("../models/request");
const Concierge = require("../models/concierge");
const { checkBody } = require("../modules/checkBody");
const User = require("../models/user");

// Function to validate message
// function validateInstruction(instruction) {
//   const messageRegex = /\bmerde\b|con/i;
//   return messageRegex.test(instruction);
// }

const messageRegex = /merde|connard|drogue|sexe/gi;
// messageRegex.lastIndex = 0;

// POST : request with empty field
router.post("/emptyRequest", (req, res) => {
  if (
    !checkBody(req.body, [
      "instruction",
      "paymentInfo",
      "date",
      "serviceFees",
      "productFees",
      "totalFees",
    ])
  )
    res.json({ result: false, error: "Champ non renseigné" });
  return;
});

//POST : Create request
router.post("/saveRequest", (req, res) => {
  const instruction = req.body.instruction;
  console.log(instruction);
  console.log(messageRegex.test(instruction));
  if (messageRegex.test(instruction)) {
    res.json({ result: false, error: "Vulgarité interdite!" });
    return;
  }

  const newRequest = new Request({
    instruction: req.body.instruction,
    paymentInfo: req.body.paymentInfo,
    date: new Date(req.body.date),
    serviceFees: req.body.serviceFees,
    productFees: req.body.productFees,
    totalFees: req.body.totalFees,
    from: req.body.from,
    fromConcierge: req.body.fromConcierge,
    photoConcierge: req.body.photoConcierge,
  });

  //saving request
  newRequest
    .save()
    .then((data) => {
      console.log(data._id);
      console.log(req.body.instruction);
      Concierge.updateOne(
        { _id: req.body.id },
        { $push: { requests: data._id } }
      ).then((data) => {
        console.log(data);
      });

      User.updateOne(
        {
          token: req.body.idClient,
        },
        { $push: { requests: data._id } }
      ).then((data) => {
        console.log(data);
      });

      res.status(200).json(newRequest);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
  console.log(instruction);
});

// GET : all requests
router.get("/requests", (req, res) => {
  Request.find()
    .then((requests) => {
      res.json({ allRequest: requests });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.post("/openRequest", (req, res) => {
  Request.findOne({ _id: req.body.id })
    .then((request) => {
      if (!request) {
        res.json({ result: "Request not found" });
      } else {
        res.json({ result: request });
      }
    })
    .catch((error) => {
      console.error("An error occurred: ", error);
      res.status(500).json({ error: "An error occurred" });
    });
});

module.exports = router;
