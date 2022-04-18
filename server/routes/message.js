const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

const SocketIo = require("../socket/socketio").getInstance();

router.post("/", async (req, res) => {
  const { socket_id, message } = req.body;
  try {
    const resultMessage = await new Message(message).save();
    res.json(resultMessage);

    SocketIo.sendMessage(socket_id, resultMessage);
  } catch (err) {
    console.log(err);
  }
});

router.get("/by-conversation", async (req, res) => {
  const  { _id}  = req.body.payload.compte
  const { contact_id, page } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { $and: [{ from: _id }, { to: contact_id }] },
        { $and: [{ to: _id }, { from: contact_id }] },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(page * 20)
      .limit(20)
      .exec();
    res.json(messages);
  } catch (error) {
    console.log(error);
  }
});

router.put("/mark-all-readed", async (req, res) => {
  const { _id: user_id } = req.body.payload.compte;
  const { contact_id, socket_id } = req.body;

  await Message.updateMany(
    { from: contact_id, to: user_id, readed: false },
    { $set: { delivred: true, readed: true } }
  ).exec();

  res.json();

  SocketIo.markAllAsReaded(socket_id, contact_id, user_id);
});

router.put("/mark-readed", async (req, res) => {
  const { _id: user_id } = req.body.payload.compte;
  const { message_id, contact_id } = req.body;

  await Message.updateOne(
    { _id: message_id },
    { $set: { delivred: true, readed: true } }
  ).exec();

  res.json();

  SocketIo.markAsReaded(contact_id, user_id, message_id);
});

router.put("/mark-all-delivred", async (req, res) => {
  const { _id: user_id } = req.body.payload.compte;
  const { contact_id } = req.body;

  await Message.updateMany(
    { from: contact_id, to: user_id, delivred: false },
    { $set: { delivred: true } }
  ).exec();

  res.json();

  SocketIo.markAllAsDelivred(contact_id, user_id);
});

router.put("/mark-delivred", async (req, res) => {
  const { _id: user_id } = req.body.payload.compte;
  const { message_id, contact_id } = req.body;

  await Message.updateOne(
    { _id: message_id },
    { $set: { delivred: true } }
  ).exec();

  res.json();

  SocketIo.markAsDelivred(contact_id, user_id, message_id);
});

module.exports = router;
