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

const io = socketIo(server, {
  cors: {
    origin: "https://quest-frontend-chi.vercel.app/",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", async (message, sender) => {
    console.log(message);

    try {
      const savedMessage = {
        date: new Date(),
        firstname: message.sender,
        message: message.message,
      };

      Request.updateOne(
        { _id: message.requestId },
        {
          $push: {
            chat: savedMessage,
          },
        }
      ).then((data) => {
        console.log(data);
      });

      io.emit("chat message", savedMessage);
      console.log("Received message:", message, message.requestId);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = router;
