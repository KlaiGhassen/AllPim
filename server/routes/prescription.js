const express = require('express');
const prescription = require('../Controllers/prescription');
const router = express.Router();




router.post('/', prescription.AddPrescription);
router.get('/:id', prescription.getprescriptionid);
router.get('/', prescription.getAllPrescription);


module.exports = router;