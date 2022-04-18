const Medicalfollowup = require("../models/medicalfollowup");
const patient = require("../models/patient");
const dayjs = require('dayjs');

let today = dayjs();




exports.getMedicalFollowupbyid = async(req, res, next) => {
    await Medicalfollowup.find({ patientId: req.params.patientId })
        .then(medicalfollowup => res.status(200).json({ medicalfollowup }))
        .catch(error => res.status(404).json({ message: " Check  " }));
}

exports.getMedicalFollowupbyDate = async(req, res, next) => {
    await Medicalfollowup.findOne({ _id: req.params._id })
        .then(medicalfollowup => res.status(200).json({ medicalfollowup }))
        .catch(error => res.status(404).json({ message: "bkr" }));
}

//add MedicalFollowup by id
exports.AddMedicalFollowup = async(req, res, next) => {
    const medicalfollowup = new Medicalfollowup({
        ...req.body,
        date: today.format("DD-MM-YYYY").toString()

    });
    console.log(req.body);
    try {
        const newMedicalFollowup = await medicalfollowup.save();

        res.status(201).json({ newMedicalFollowup });
    } catch (err) {
        res.status(500).json({ message: error.message })
    }
}


//get all MedicalFollowup
exports.getAllMedicalFollowup = (req, res, next) => {
    Medicalfollowup.find()
        .then(Medicalfollowup => res.status(200).json(Medicalfollowup))
        .catch(error => res.status(400).json({ error }));
}


//update MedicalFollowup
exports.updateMedicalfollowup = async(req, res, next) => {
    try {
        app = await Medicalfollowup.find({ _id: req.params.id });
        if (app == null) {
            return res.status(404).json({ message: "cannot find app" });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.app = app[0];


    if (req.body.medical_analysis_interpretation != null) {
        res.app.medical_analysis_interpretation = req.body.medical_analysis_interpretation;
    }
    if (req.body.chronic_diseases != null) {
        res.app.chronic_diseases = req.body.chronic_diseases;
    }
    if (req.body.notes != null) {
        res.app.notes = req.body.notes;
    }
    console.log(req.body.notes);
    try {
        res.app.save().then((updatedapp) => {
            res.json(updatedapp);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


//delete MedicalFollowup
exports.deleteMedicalfollowup = (req, res, next) => {
    Medicalfollowup.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'MedicalFollowup deleted !' }))
        .catch(error => res.status(400).json({ error }));
}