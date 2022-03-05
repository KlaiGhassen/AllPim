
const mongoose = require("mongoose");

const appointementSchema = new mongoose.Schema({
    identifant: { type: String, required: true },
    patientId: String,
    docId: String ,
    state: String, 
    date: Date,
    place: String
});
module.exports = mongoose.model("appointement", appointementSchema);