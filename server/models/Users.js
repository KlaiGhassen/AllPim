const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    title:String,
    country:String,
    full_name: String,
    email: { type: String, unique: true },
    password: String,
    phone_number: Number,
    profilePicture:{ type: String, default: "default.png" },
    diploma: { type: Boolean, default: false },
    full_name: String,
    social: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    description: String,
    role:String,
    docId: String,
    user_name:String,
    contacts:[mongoose.Types.ObjectId]
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("users", userSchema);
