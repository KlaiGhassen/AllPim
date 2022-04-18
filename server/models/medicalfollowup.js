const mongoose = require("mongoose");

const medicalFollowUpSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patient',
        require: true
            // type: String
    },
    notes: String,
    medical_analysis_interpretation: String,
    chronic_diseases: String,
    date: String


});
module.exports = mongoose.model("medicalFollowUp", medicalFollowUpSchema);