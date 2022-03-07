const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    title:String,
    country:String,
    full_name: String,
    email: { type: String, unique: true },
    password: String,
    phone_number: Number,
    profilePicture: String,
    diploma: { type: String, default: "default.png" },
    full_name: String,
    social: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    description: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("ophto", userSchema);
