var express = require("express");
var router = express.Router();
const Request = require("../models/request");
const { checkBody } = require("../modules/checkBody");

router.delete("/delete/:id", (req, res) => {
  console.log(req.body);
  Request.deleteOne({ _id: req.params.id })

    .then((data) => {
      console.log(data);
      res.json({ result: data });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "Une erreur s'est produite lors de la suppression." });
    });
  console.log("ID to delete:", req.body._id);
});
module.exports = router;
