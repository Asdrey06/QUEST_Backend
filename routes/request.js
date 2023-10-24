var express = require("express");
var router = express.Router();
const Request = require("../models/request");
const { checkBody } = require("../modules/checkBody");

// Function to validate message
// function validateMessage(message) {
//   if (message.match(/merde/i)) {
//     return messageRegex.test(message);
//   }
// }

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
    res.json({ result: false, error: "Champ non renseigne" });
  return;
});

// const message = req.body.instruction;
// if (!validateMessage(message)) {
//   res.json({ result: false, error: "Vulgarité interdite!" });
//   return;
// }

//POST : Create request
router.post("/saveRequest", (req, res) => {
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
