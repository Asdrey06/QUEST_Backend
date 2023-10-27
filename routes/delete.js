var express = require("express");
var router = express.Router();
const Request = require("../models/request");
const { checkBody } = require("../modules/checkBody");

router.delete("/delete", (req, res) => {
  Request.deleteOne({ _id: req.body._id })

    .then((data) => {
      console.log(data);
      res.json({ result: data });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "Une erreur s'est produite lors de la suppression." });
    });
});
module.exports = router;
