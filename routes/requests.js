var express = require("express");
var router = express.Router();
const Request = require("../models/request");

router.post("/requests", async (req, res) => {
  //POST : Create requests
  const newRequest = new Request({
    instruction: req.body.instruction,
    paymentInfo: req.body.paymentInfo,
    date: new Date(req.body.date),
    serviceFees: req.body.serviceFees,
    productFees: req.body.productFees,
    totalFees: req.body.totalFees,
  });

  //saving requests
  newRequest
    .save()
    .then((newReq) => {
      res.status(201).json(newRequest);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});

// GET : Get all requests
router.get("/requests", (req, res) => {
  Request.find()
    .then((requests) => {
      res.json(requests);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;
