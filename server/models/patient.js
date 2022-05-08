const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    phoneNumber: Number,
    profilePicture: { type: String, default: "" },
    full_name: String,
    social: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    description: String,
    gender: { type: String, enum: ['Male', 'Female'] },
    Bday: String,

}, {
    timestamps: true,
});
module.exports = mongoose.model("patient", userSchema);