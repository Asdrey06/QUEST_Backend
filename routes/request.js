var express = require("express");
var router = express.Router();

const Request = require("../models/request");
const Concierge = require("../models/concierge");
const { checkBody } = require("../modules/checkBody");
const User = require("../models/user");
const FinishedRequest = require("../models/finishedRequest");

router.post("http://localhost:3000/emptyRequest", (req, res) => {
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
    done: false,
    conciergeId: req.body.conciergeId,
    clientToken: req.body.clientToken,
  });

  //saving request
  newRequest
    .save()
    .then((data) => {
      console.log("THIS", data);
      console.log(data._id);
      console.log(req.body.instruction);
      Concierge.updateOne(
        { _id: req.body.conciergeId },
        { $push: { requests: data._id } }
      ).then((data) => {
        console.log(data);
      });

      User.updateOne(
        {
          token: req.body.clientToken,
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
});

//POST : Finish request
router.post("/finishedRequest", (req, res) => {
  const instruction = req.body.instruction;

  const newFinishedRequest = new FinishedRequest({
    instruction: req.body.instruction,
    paymentInfo: req.body.paymentInfo,
    date: req.body.date,
    serviceFees: req.body.serviceFees,
    productFees: req.body.productFees,
    totalFees: req.body.totalFees,
    from: req.body.from,
    fromConcierge: req.body.fromConcierge,
    photoConcierge: req.body.photoConcierge,
    conciergeId: req.body.conciergeId,
    clientToken: req.body.clientToken,
    chat: req.body.chat,
    pastRequestId: req.body.pastRequestId,
    done: true,
  });

  //saving request
  newFinishedRequest
    .save()
    .then((data) => {
      Concierge.updateOne(
        { _id: req.body.conciergeId },
        {
          $pull: { requests: req.body.pastRequestId },
          $push: { totalEarned: req.body.serviceFees },
        }
      ).then((data) => {
        console.log(data);
      });

      User.updateOne(
        {
          token: req.body.clientToken,
        },
        { $pull: { requests: req.body.pastRequestId } }
      ).then((data) => {
        console.log(data);
      });

      res.status(200).json(newFinishedRequest);
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

router.post("/changeRequestStatus", (req, res) => {
  Request.updateOne(
    {
      _id: req.body.id,
    },
    { done: true }
  ).then((data) => {
    console.log(data);
  });
});

router.post("/changeRequestStatusToFalse", (req, res) => {
  Request.updateOne(
    {
      _id: req.body.id,
    },
    { done: false }
  ).then((data) => {
    console.log(data);
  });
});

router.post("/getChat", (req, res) => {
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

router.post("/getFinishedRequestClient", (req, res) => {
  FinishedRequest.find({ clientToken: req.body.token })
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

router.post("/getFinishedRequestConcierge", (req, res) => {
  Concierge.find({ token: req.body.token }).then((data) => {
    console.log("this", data[0]._id);

    FinishedRequest.find({ conciergeId: data[0]._id })
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
});

router.delete("/delete", (req, res) => {
  Request.deleteOne({ _id: req.body.id })

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
