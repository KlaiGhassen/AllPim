const mongoose = require("mongoose");


const transactionSchema = new mongoose.Schema({
    id: String,
    docId: String ,
    state: Boolean, 
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    price: Number

});

module.exports = mongoose.model("transaction", transactionSchema);