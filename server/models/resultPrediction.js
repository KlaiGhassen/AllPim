const mongoose = require("mongoose");
const resultSchema = new mongoose.Schema({
    id: String,
    user_id: String,
    result_value: String
    
});

module.exports = mongoose.model("resultPrediction", resultSchema);