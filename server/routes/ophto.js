var express = require("express");
const Ophto = require("../models/ophto");
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
    console.log(req.body);
    const ophto = new Ophto({
        email: req.body.email,
        password: req.body.password,
        phone_number: req.body.phone_number,
        full_name: req.body.full_name,
        description: req.body.description,
    });
    try {
        const newOphto = await ophto.save();
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
    if (req.body.identifant != null) {
        res.ophto.identifant = req.body.identifant;
    }
    if (req.body.email != null) {
        res.ophto.email = req.body.email;
    }
    if (req.body.password != null) {
        res.ophto.password = req.body.password;
    }
    if (req.body.phoneNumber != null) {
        res.ophto.phoneNumber = req.body.phoneNumber;
    }
    if (req.body.profilePicture != null) {
        res.ophto.profilePicture = req.body.profilePicture;
    }
    if (req.body.FirstName != null) {
        res.ophto.FirstName = req.body.FirstName;
    }
    if (req.body.LastName != null) {
        res.ophto.LastName = req.body.LastName;
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
    if (req.body.description != null) {
        res.ophto.description = req.body.description;
    }
    if (req.body.className != null) {
        res.ophto.className = req.body.className;
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

module.exports = router;