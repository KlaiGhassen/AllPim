const mongoose = require("mongoose");

const messageShcema = new mongoose.Schema({
  from: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  to: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  readed: {
    type: Boolean,
    default: false,
  },
  delivred: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("messages", messageShcema);
