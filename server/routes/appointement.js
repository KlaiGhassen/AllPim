var express = require("express");
const App = require("../models/appointement");
var router = express.Router();

const { POINT_CONVERSION_COMPRESSED } = require("constants");


//get all Appointements
router.get("/", async(req, res, next) => {
    try {
        const apps = await App.find();
        res.json(apps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// get one appointement by 

router.get("/:id", getApp, (req, res) => {
    console.log(res.app)
    res.json(res.app);
});



router.get("/appById/:identifiant", async(req, res, next) => {
    try {
        const app = await App.find({ identifiant: req.params.identifiant });
        res.json(app);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//add Appointment



router.post("/", async(req, res, next) => {
    console.log(req.body);
    const app = new App({
        id: req.body.id,
        patientId: req.body.patientId,
        docId: req.body.docId,
        patientConfirm: req.body.patientConfirm,
        doctorConfirm: req.body.doctorConfirm,
        state: req.body.state,
        date: req.body.date,
        place: req.body.place,
    });
    try {
        const newApp = await app.save();

        res.status(201).json({ newApp });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            res.json({ isemail: true });
        }
    }
});


//delet one app

router.delete("/:identifiant", getApp, async(req, res) => {
    console.log(res.app)
    try {
        await res.app.remove();
        res.status(200).json({ message: "deleted app" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// update app

router.patch("/:id", getApp, (req, res) => {
    console.log(req.params, req.body)
   
    
    
    if (req.body.patientConfirm != null) {
        res.app.patientConfirm = req.body.patientConfirm;
    }
    if (req.body.doctorConfirm != null) {
        res.app.doctorConfirm = req.body.doctorConfirm;
    }
    if (req.body.state != null) {
        res.app.state = req.body.state;
        
    }
    console.log("state",req.body.state);
    try {
        res.app.save().then((updatedapp) => {
            res.json(updatedapp);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



async function getApp(req, res, next) {
    console.log(req.params.identifiant)
    try {
        app = await App.findById(req.params.id );
        if (app == null) {
            return res.status(404).json({ message: "cannot find app" });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.app = app;
    next();
}

module.exports = router;