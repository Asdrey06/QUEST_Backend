var express = require("express");
var router = express.Router();
const Chat = require("../models/chat");
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");

// Route to create a new chat
router.post('/savechat', (req, res) => {
    const newChat = new Chat({
        date: req.body.date,
        firstname: req.body.firstname,
        username: req.body.username,
        message: req.body.message,
    });

    newChat
        .save()
        .then((newDoc) => {
            res.json({ result: true, data: newDoc });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ result: false, error: "Erreur lors de la sauvegarde du chat." });
        });
});
    
    






module.exports = router;