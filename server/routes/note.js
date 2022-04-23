var express = require("express");
const Note = require("../models/note");
var router = express.Router();

const { POINT_CONVERSION_COMPRESSED } = require("constants");



//get all Appointements
router.get("/", async(req, res, next) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get("/byDocId/:docId", async(req, res, next) => {
    try {
        const note = await Note.find({ docId: req.params.docId });
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});






// get one appointement by 

router.get("/:id", getNote, (req, res) => {
    console.log(res.note)
    res.json(res.note);
});



//add Appointment



router.post("/", async(req, res, next) => {
    console.log(req.body);
    const note = new Note({
        id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        docId: req.body.docId,
        archived: req.body.archived,
    });
    try {
        const newNote = await note.save();

        res.status(201).json({ newNote });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            res.json({ isemail: true });
        }
    }
});


//delet one note

router.delete("/:id", getNote, async(req, res) => {
   
    try {
        await res.note.remove();
        console.log("barra mriguel")
    } catch (err) {
        console.log("a7bess fam w jib cigarou w 9ahwa bech nassehrou fama mochkla")
    }
});



// update note

router.patch("/:id", getNote, (req, res) => {
    //console.log(req.params, req.body)
    console.log("date");
    
    
    if (req.body.archived != null) {
        res.note.patientConfirm = req.body.patientConfirm;
    }


    try {
        res.note.save().then((updatednote) => {
            res.json(updatednote);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



async function getNote(req, res, next) {
    console.log(req.params.id)
    try {
        note = await Note.findById(req.params.id );
        if (note == null) {
            return res.status(404).json({ message: "cannot find note" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.note = note;
    next();
}


module.exports = router;