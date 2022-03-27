
const mongoose = require("mongoose");


const appointementSchema = new mongoose.Schema({
    id: String,
    calendarId: String,
    title: String,
    patientId: String,
    docId: String ,
    patientConfirm: Boolean,
    doctorConfirm: Boolean,
    state: String, 
    date: Date,
    place: String
});

module.exports = mongoose.model("appointement", appointementSchema);