const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    patientId: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'patient',
        // require: true
        type: String
    },
    prescription: String

});
module.exports = mongoose.model("prescription", prescriptionSchema);