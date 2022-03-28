const tesseract = require("tesseract.js")
var express = require("express");
const { json } = require("express");
var router = express.Router();


async function licenseVerification(image){
 return tesseract.recognize(image,"eng",{logger: (m) => console.log(m)})
}
module.exports = {licenseVerification};