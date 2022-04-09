var express = require("express");
const Ophto = require("../models/ophto");
var router = express.Router();
const ocr = require("../routes/ocr");
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

/* GET ophtos listing. */

//get all ophtos

router.get("/", async(req, res, next) => {
    try {
        const ophtos = await Ophto.find();
        res.json(ophtos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// get one ophto


router.get("/:email", getOphto, (req, res) => {
    console.log(res.ophto)
    res.json(res.ophto);
});



router.get("/ophtoByEmail/:email", async(req, res, next) => {
    try {
        const ophto = await Ophto.find({ email: req.params.email });
        res.json(ophto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//add Ophto

router.post("/", async(req, res, next) => {
    console.log("hello",req.body);
    const ophto = new Ophto({
        email: req.body.email,
        password: req.body.password,
        phone_number: req.body.phone_number,
        full_name: req.body.full_name,
        description: req.body.description,
        role: req.body.role
    });
    try {
        const newOphto = await ophto.save();
        console.log(newOphto.role)
        res.status(201).json({ newOphto });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            res.json({ email: true });
        }
    }
});


//delet one ophto


router.delete("/:email", getOphto, async(req, res) => {
    console.log(res.ophtoy)
    try {
        await res.ophto.remove();
        res.status(200).json({ message: "deleted ophto" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.patch("/:email", getOphto, (req, res) => {
    console.log(req.params, req.body)


    if (req.body.country != null) {
        res.ophto.country = req.body.country;
    }
    if (req.body.email != null) {
        res.ophto.email = req.body.email;
    }
    if (req.body.password != null) {
        res.ophto.password = req.body.password;
    }
    if (req.body.phone_number != null) {
        res.ophto.phone_number = req.body.phone_number;
    }
    if (req.body.profilePicture != null) {
        res.ophto.profilePicture = req.body.profilePicture;
    }
    if (req.body.full_name != null) {
        res.ophto.full_name = req.body.full_name;
    }
    if (req.body.verified != null) {
        res.ophto.verified = req.body.verified;
    }
    if (req.body.social != null) {
        res.ophto.social = req.body.social;
    }
    if (req.body.role != null) {
        res.ophto.role = req.body.role;
    }
    if (req.body.title != null) {
        res.ophto.title = req.body.title;
    }
    if (req.body.description != null) {
        res.ophto.description = req.body.description;
    }
    if (req.body.diploma != null) {
        res.ophto.diploma = req.body.diploma;
    }

    try {
        res.ophto.save().then((updatedophto) => {
            res.json(updatedophto);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

async function getOphto(req, res, next) {
    console.log(req.params.email)
    try {
        ophto = await Ophto.find({ email: req.params.email });
        if (ophto == null) {
            return res.status(404).json({ message: "cannot find ophto" });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.ophto = ophto[0];
    next();
}


// Ocr abaguishagggggggyyyyyyyyy ena li sna3tou el skiiiiiiipe
router.patch("/license/:email", upload.single('file'), getOphto ,async(req, res, next) => {
    try 
   {
       const rr = await ocr.licenseVerification(req.file.path).then((result) => {
         //console.log(result.data.text);
        
         console.log(result.data.text)
 if(result.data.text.includes("Medical") || result.data.text.includes("Medical") || result.data.text.includes("Medicale") || result.data.text.includes("medicale")){
    
        res.ophto.diploma = true;
    
     console.log("Accepted");
     res.json(true);
 }
 else {
     console.log("Rejected")
     res.ophto.diploma = false;
     res.json(false);
 }
         return result.data.text;
       
     })
     ;
 
 }
   catch (error) {
     res.status(500).json({ message: error.message });
 }
 try {
    res.ophto.save().then((updatedophto) => {
        //res.json(updatedophto);
    });
} catch (error) {
    //res.status(400).json({ message: error.message });
}
 });
 
module.exports = router;