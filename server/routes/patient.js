var express = require("express");
const Patient = require("../models/patient");
var router = express.Router();
const multer = require("multer");
const { POINT_CONVERSION_COMPRESSED } = require("constants");

const picsPath = require("path").resolve(__dirname, "../uploads");
router.get("/download/:nom", function(req, res) {
    let nom = req.params.nom;
    const file = picsPath + "/" + nom;
    console.log(file, "hy");
    res.sendFile(file); // Set disposition and send it.
});

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        var filetype = "";
        var fileExtension = "";
        if (file.mimetype === "image/gif") {
            filetype = "image-";
            fileExtension = "gif";
        }
        if (file.mimetype === "image/png") {
            filetype = "image-";
            fileExtension = "png";
        }
        if (file.mimetype === "image/jpeg") {
            filetype = "image-";
            fileExtension = "jpeg";
        }

        cb(null, filetype + Date.now() + "." + fileExtension);
        h = cb;
    },
});
var upload = multer({
    storage: storage,
});

router.get("/patientById/:id", async(req, res, next) => {
    try {
        const patient = await Patient.findOne({ _id: req.params.id });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// download picture to the server
router.post("/file", upload.single("file"), function(req, res, next) {
    if (!req.file) {
        res.status(500);
        return next(err);
    }
    res.json({
        img: req.file.filename,
    });
});

/* GET patients listing. */

//get all patients

router.get("/", async(req, res, next) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// get one patient


router.get("/:email", getPatient, (req, res) => {
    console.log(res.patient)
    res.json(res.patient);
});



router.get("/patientByEmail/:email", async(req, res, next) => {
    try {
        const patient = await Patient.find({ email: req.params.email });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//add Patient
Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);
    return this;
}
router.post("/", async(req, res, next) => {

    var d = new Date(req.body.Bday);
    //d.addHours(-1);
    req.body.Bday = d;
    console.log(req.body);
    const patient = new Patient({
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        full_name: req.body.full_name,
        gender: req.body.gender,
        description: req.body.description,
        profilePicture: req.body.profilePicture,
        Bday: d,


    });
    try {
        if (patient.profilePicture == "") {
            if ((patient.gender == "Female")) {

                patient.profilePicture = "https://res.cloudinary.com/showapp/image/upload/v1648774354/patient_kla7oe.jpg"

            }
            if ((patient.gender == "Male")) {
                patient.profilePicture = "https://res.cloudinary.com/showapp/image/upload/v1650655289/male_qlxcba.jpg"
            }
        }
        const newPatient = await patient.save();
        res.status(201).json({ newPatient });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            res.status(400).json({ email: true });
        }
    }
});


//delet one patient


router.delete("/:email", getPatient, async(req, res) => {
    console.log(res.patienty)
    try {
        await res.patient.remove();
        res.status(200).json({ message: "deleted patient" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.patch("/:email", getPatient, (req, res) => {
    console.log(req.params, req.body)
    if (req.body.identifant != null) {
        res.patient.identifant = req.body.identifant;
    }
    if (req.body.email != null) {
        res.patient.email = req.body.email;
    }
    if (req.body.password != null) {
        res.patient.password = req.body.password;
    }
    if (req.body.phoneNumber != null) {
        res.patient.phoneNumber = req.body.phoneNumber;
    }
    if (req.body.profilePicture != null) {
        res.patient.profilePicture = req.body.profilePicture;
    }
    if (req.body.FirstName != null) {
        res.patient.FirstName = req.body.FirstName;
    }
    if (req.body.LastName != null) {
        res.patient.LastName = req.body.LastName;
    }
    if (req.body.verified != null) {
        res.patient.verified = req.body.verified;
    }
    if (req.body.social != null) {
        res.patient.social = req.body.social;
    }
    if (req.body.role != null) {
        res.patient.role = req.body.role;
    }
    if (req.body.description != null) {
        res.patient.description = req.body.description;
    }
    if (req.body.className != null) {
        res.patient.className = req.body.className;
    }

    try {
        res.patient.save().then((updatedpatient) => {
            res.json(updatedpatient);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

async function getPatient(req, res, next) {
    console.log(req.params.email)
    try {
        patient = await Patient.find({ email: req.params.email });
        if (patient == null) {
            return res.status(404).json({ message: "cannot find patient" });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.patient = patient[0];
    next();
}

module.exports = router;