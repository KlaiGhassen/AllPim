const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema({
    id: String,
    title: String,
    content: String,
    docId: String ,
    archived: Boolean
});

module.exports = mongoose.model("note", noteSchema);