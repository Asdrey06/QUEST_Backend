var express = require("express");
var router = express.Router();
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const Chat = require("../models/chat");
const Request = require("../models/request");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
