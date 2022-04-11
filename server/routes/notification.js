var express = require("express");
const Notification = require("../models/notification");
const tesseract = require("tesseract.js")
const ocr = require("../routes/ocr")
var router = express.Router();
const multer = require("multer");

const { POINT_CONVERSION_COMPRESSED } = require("constants");



//get all Appointements
router.get("/", async(req, res, next) => {
    try {
        const apps = await Notification.find();
        res.json(apps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.get("/byDocId/:docId", async(req, res, next) => {
    try {
        const app = await Notification.find({ docId: req.params.docId });
        res.json(app);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/byPatientId/:patientId", async(req, res, next) => {
    try {
        const app = await Notification.find({ patientId: req.params.patientId });
        res.json(app);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get one notification by 
router.get("/:id", getApp, (req, res) => {
    console.log(res.app)
    console.log("olaaaaaaaaaaaaaaa",res.app.date.getHours())
    res.json(res.app);
});



router.get("/appById/:identifiant", async(req, res, next) => {
    try {
        const app = await Notification.find({ identifiant: req.params.identifiant });
        res.json(app);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//add Notification



router.post("/", async(req, res, next) => {
    console.log(req.body);
    const notification = new Notification({
        id: req.body.id,
        icon: req.body.icon,
        title: req.body.title,
        patientId: req.body.patientId,
        docId: req.body.docId,
        description: req.body.description,
        time: req.body.time,
        read: req.body.read,
        image: req.body.image,
        link: req.body.link,
        useRouter: req.body.useRouter,
    });
    try {
        const newNotification = await notification.save();

        res.status(201).json({ newNotification });
    } catch (err) {
        console.log(err);
        
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
   
    
    
    if (req.body.read != null) {
        res.app.read = req.body.read;
    }
     
    try {
        res.app.save().then((updatedapp) => {
            res.json(updatedapp);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//mark as read:
router.patch("/markAsRead/:id", getApp, (req, res) => {
    if (req.body.read != null) {
        res.app.read = req.body.read;
    }
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
        app = await Notification.findById(req.params.id );
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