const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    fname: { type: String},
    lname: { type: String},
    password: String,
    user: String,
    roles: Number,
});
module.exports = mongoose.model("admin", userSchema);