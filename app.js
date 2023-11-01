require("dotenv").config();
require("./models/connection");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var deleteRouter = require("./routes/delete");
var conciergesRouter = require("./routes/concierges");
var requestRouter = require("./routes/request");
var chatRouter = require("./routes/chat");

const cors = require("cors");

var app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const Request = require("./models/request");

// Import the Stripe library and set your secret key
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: "usd",
    });

    res.json({ clientSecret: paymentIntent.client_secret });
    console.log(paymentIntent.client_secret);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
});

app.post("/processpayment", async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    console.log(paymentMethodId);

    const paymentIntent = await stripe.paymentIntents.create({
      payment_method: paymentMethodId,
      amount: 1000,
      currency: "usd",
      confirm: true,
      return_url: "https://google.com",
    });
    console.log("great payment success");

    return res.json({ success: true, paymentIntent });
  } catch (error) {
    console.error("Error processing payment:", error);
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
});

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

app.post("/sendmessage", (req, res) => {
  const { message, sender, userType } = req.body;

  console.log(req.body.message);

  console.log("this", req.body.sender);

  console.log("thes", req.body.userType);

  console.log(req.body.id);

  // Do something with the message, e.g., store it in a database

  // Broadcast the message to connected clients using Pusher
  pusher
    .trigger("quest-livechat", "message", {
      message: req.body.message,
      sender: req.body.sender,
      userType: req.body.userType,
    })
    .then((data) => {
      const savedMessage = {
        date: new Date(),
        firstname: req.body.sender,
        message: req.body.message,
      };
      Request.updateOne(
        { _id: req.body.id },
        {
          $push: {
            chat: savedMessage,
          },
        }
      ).then((data) => {
        console.log(data);
      });
    });

  res.json({ success: true });
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/delete", deleteRouter);
app.use("/concierges", conciergesRouter);
app.use("/request", requestRouter);
app.use("/chat", chatRouter);

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

module.exports = app;
