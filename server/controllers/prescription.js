const Prescription = require("../models/prescription");




//get prescription by id
exports.getprescriptionid = (req, res, next) => {
    Prescription.findOne({ _id: req.params.id })
        .then(Prescription => res.status(200).json(Prescription))
        .catch(error => res.status(404).json({ message: error.message }));
}


//add prescription by id
exports.AddPrescription = async(req, res, next) => {
    const prescription = new Prescription({
        ...req.body
    });
    try {
        const newPrescription = await prescription.save();

        res.status(201).json({ newPrescription });
    } catch (err) {
        res.status(500).json({ message: error.message })
    }
}


//get all prescription
exports.getAllPrescription = (req, res, next) => {
    Prescription.find()
        .then(Prescription => res.status(200).json(Prescription))
        .catch(error => res.status(400).json({ error }));
}