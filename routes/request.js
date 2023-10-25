var express = require("express");
var router = express.Router();
const Request = require("../models/request");
const { checkBody } = require("../modules/checkBody");

const messageRegex = /merde|connard|drogue|sexe/i;

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
    console.log("g dit 1 gros mot");
    res.json({ result: false, error: "Vulgarité interdite!" });
    return;
  }
  console.log("Pas de gros mot");
  const newRequest = new Request({
    instruction: req.body.instruction,
    paymentInfo: req.body.paymentInfo,
    date: new Date(req.body.date),
    serviceFees: req.body.serviceFees,
    productFees: req.body.productFees,
    totalFees: req.body.totalFees,
  });

  //saving request
  newRequest
    .save()
    .then(() => {
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

module.exports = router;
