const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema({
    id: String,
    icon: String,
    title: String,
    patientId: String,
    docId: String,
    description: String,
    time: { type: Date, default: Date.now },
    read: Boolean,
    image: String,
    link: String,
    useRouter: Boolean,
});

module.exports = mongoose.model("notification", notificationSchema);