const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: String,
    phone_number: Number,
    profilePicture: { type: String, default: "default.png" },
    diploma: { type: String, default: "default.png" },
    fullName: String,
    social: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    description: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("ophto", userSchema);
