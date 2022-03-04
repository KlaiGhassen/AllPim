var express = require("express");
const Elearning = require("../models/Elearning");
var router = express.Router();

router.get("/", async(req, res, next) => {
    try {
        const elearnings = await Elearning.find();
        res.json(elearnings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get("/byModule/:module", getLearningByModule, (req, res) => {
    res.json(res.elearning);
});


router.get("/:id", getElearning, (req, res) => {
    res.json(res.elearning);
});


router.post("/", async(req, res, next) => {
    const elearning = new Elearning({
        publisheId: req.body.publisheId,
        publishedAt: req.body.publishedAt,
        className: req.body.className,
        module: req.body.module,
        courseName: req.body.courseName,
        courseFile: req.body.courseFile


    });


    try {
        const newElearning = await elearning.save();

        res.status(201).json({ newElearning });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", getElearning, async(req, res) => {
    try {
        await res.elearning.remove();
        res.json({ message: "deleted elearning" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.patch("/:id", getElearning, (req, res) => {
    if (req.body.publisheId != null) {
        res.elearning.publisheId = req.body.publisheId;
    }
    if (req.body.publishedAt != null) {
        res.elearning.publishedAt = req.body.publishedAt;
    }
    if (req.body.className != null) {
        res.elearning.className = req.body.className;
    }
    if (req.body.courseName != null) {
        res.elearning.courseName = req.body.courseName;
    }
    if (req.body.courseFile != null) {
        res.elearning.courseFile = req.body.courseFile;
    }

    try {
        res.elearning.save().then((updatedElearning) => {
            res.json(updatedElearning);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

async function getElearning(req, res, next) {
    try {
        elearning = await Elearning.findById(req.params.id);
        if (elearning == null) {
            return res.status(404).json({ message: "cannot find elearning" });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.elearning = elearning;
    next();
}

async function getLearningByModule(req, res, next) {
    try {
        elearning = await Elearning.find( {module : req.params.module});
        if (elearning == null) {
            return res.status(404).json({ message: "cannot find elearning" });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.elearning = elearning;
    next();
}

module.exports = router;