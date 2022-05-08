var express = require("express");
const App = require("../models/appointement");
const tesseract = require("tesseract.js")
const ocr = require("../routes/ocr")
var router = express.Router();
const multer = require("multer");

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
router.get("/app/pending", async (req, res)=>
{
    const app = await App.find({ state: "Pending" });

    return res.json(app);


})
router.get("/app/confirmed", async (req, res)=>
{
    const app = await App.find({ state: "Confirmed" });

    return res.json(app);


})

router.get("/byPatientId/:patientId", async(req, res, next) => {
    try {
        const app = await App.find({ patientId: req.params.patientId });
        res.json(app);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/byDocId/:docId", async(req, res, next) => {
    try {
        const app = await App.find({ docId: req.params.docId });
        res.json(app);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const picsPath = require("path").resolve(__dirname, "../uploads");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        console.log()
        var filetype = "";
        var fileExtension = "";
        console.log("file###################################################################", file.mimetype)
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
        if (file.mimetype === "application/pdf") {
            filetype = "pdf-"
            fileExtension = "pdf"

        }

    cb(null, filetype + Date.now() + "." + fileExtension);
    h = cb;
  },
});
var upload = multer({
  storage: storage,
});

//ocr test
router.post("/license", upload.single('file') ,async(req, res, next) => {
   try 
  {
      const rr = await ocr.licenseVerification(req.file.path).then((result) => {
        //console.log(result.data.text);
       
        console.log(result.data.text)
if(result.data.text.includes("zwayten")){
    console.log("Accepted");
}
else {
    console.log("Rejected")
}
        return result.data.text;
        
       /* if(result.data.text.includes("zwayten") ){
            console.log("hafffffffellllllliiiiii");
           return true;
        }
        else 
          return 
          */
       
    })
    ;

}
  catch (error) {
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

    
    if (req.body.patientConfirm == true && res.app.doctorConfirm == false ) {
        res.app.patientConfirm = req.body.patientConfirm;
        res.app.calendarId = "1a470c8e-40ed-4c2d-b590-a4f1f6ead6cc"
        res.app.state = "Pending"
    }
    if (res.app.patientConfirm == true && req.body.doctorConfirm == false ) {
        res.app.doctorConfirm = req.body.doctorConfirm;
        res.app.calendarId = "1a470c8e-40ed-4c2d-b590-a4f1f6ead6cc"
        res.app.state = "Pending"
    }

    if (req.body.patientConfirm == false && res.app.doctorConfirm == false ) {
        res.app.patientConfirm = req.body.patientConfirm;
        res.app.calendarId = "09887870-f85a-40eb-8171-1b13d7a7f529"
        res.app.state = "Declined"
    }

    if (req.body.doctorConfirm == false && res.app.patientConfirm == false ) {
        res.app.doctorConfirm = req.body.doctorConfirm;
        res.app.calendarId = "09887870-f85a-40eb-8171-1b13d7a7f529"
        res.app.state = "Declined"
    }


    if (res.app.patientConfirm == true && req.body.doctorConfirm == true ) {
        res.app.doctorConfirm = req.body.doctorConfirm;
        res.app.calendarId = "5dab5f7b-757a-4467-ace1-305fe07b11fe"
        res.app.state = "Confirmed"
    }
    if (res.app.doctorConfirm == true && req.body.patientConfirm == true ) {
        res.app.patientConfirm = req.body.patientConfirm;
        res.app.calendarId = "5dab5f7b-757a-4467-ace1-305fe07b11fe"
        res.app.state = "Confirmed"
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