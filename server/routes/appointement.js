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
    console.log("olaaaaaaaaaaaaaaa",res.app.date.getHours())
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

router.get("/checkdate/:docId/:date", async(req, res, next) => {
    try {
        
        const app = await App.find({ docId: req.params.docId, date: req.params.date.setHours(req.params.date.getHours() + 1) });
        res.json(true);
        console.log("tnajem")
    } catch (error) {
        res.json(false);
        console.log("niet")
        //console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",req.params.date.setHours(req.params.date.getHours() + 1))
    }
});

//add Appointment



router.post("/", async(req, res, next) => {
    console.log(req.body);
    const app = new App({
        id: req.body.id,
        calendarId: req.body.calendarId,
        patientId: req.body.patientId,
        title: req.body.title,
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

router.delete("/:id", getApp, async(req, res) => {
   
    try {
        await res.app.remove();
        console.log("barra mriguel")
    } catch (err) {
        console.log("a7bess fam w jib cigarou w 9ahwa bech nassehrou fama mochkla")
    }
});



// update app

router.patch("/:id", getApp, (req, res) => {
    //console.log(req.params, req.body)
    console.log("date");
    
    
    if (req.body.patientConfirm != null) {
        res.app.patientConfirm = req.body.patientConfirm;
    }
    if (req.body.doctorConfirm != null) {
        res.app.doctorConfirm = req.body.doctorConfirm;
    }
    if (req.body.state != null) {
        res.app.state = req.body.state;
        
    }
    if (req.body.date != null) {
        res.app.date = req.body.date;
        
    }
    console.log("date",req.body.date);
    try {
        res.app.save().then((updatedapp) => {
            res.json(updatedapp);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



async function getApp(req, res, next) {
    console.log(req.params.id)
    try {
        app = await App.findById(req.params.id );
        if (app == null) {
            return res.status(404).json({ message: "cannot find app" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.app = app;
    next();
}



module.exports = router;