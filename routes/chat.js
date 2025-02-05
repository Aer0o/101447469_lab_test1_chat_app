const express = require("express");
const GroupMessage = require("../models/GroupMessage");
const PrivateMessage = require("../models/PrivateMessage");

const router = express.Router();

// Get room messages
router.get("/room/:room", async (req, res) => {
  const messages = await GroupMessage.find({ room: req.params.room });
  res.json(messages);
});

// Get private messages
router.get("/private/:from/:to", async (req, res) => {
  const messages = await PrivateMessage.find({
    $or: [
      { from_user: req.params.from, to_user: req.params.to },
      { from_user: req.params.to, to_user: req.params.from },
    ],
  });
  res.json(messages);
});

// Send message to a room
router.post("/room", async (req, res) => {
  const { from_user, room, message } = req.body;
  const newMessage = new GroupMessage({ from_user, room, message });
  await newMessage.save();
  res.json(newMessage);
});

// Send private message
router.post("/private", async (req, res) => {
  const { from_user, to_user, message } = req.body;
  const newMessage = new PrivateMessage({ from_user, to_user, message });
  await newMessage.save();
  res.json(newMessage);
});

module.exports = router;
