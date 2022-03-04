const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    identifant: { type: String, required: true },
    email: { type: String, unique: true },
    password: String,
    phoneNumber: Number,
    profilePicture: { type: String, default: "default.png" },
    FirstName: String,
    LastName: String,
    social: { type: Boolean, default: false },
    role: String,
    verified: { type: Boolean, default: false },
    className: String,
    description: String
});
module.exports = mongoose.model("user", userSchema);