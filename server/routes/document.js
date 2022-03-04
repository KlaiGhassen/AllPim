var express = require("express");
const Document = require("../models/document");
var router = express.Router();

/* GET users listing. */
router.get("/", async(req, res, next) => {
    try {
        const document = await Document.find();
        res.json(document);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Post users
router.get("/:claimedId", getDocument, (req, res) => {
    res.json(res.document);
});

router.post("/", async(req, res, next) => {
    const document = new Document({
        documentType: req.body.documentType,
        claimedId: req.body.claimedId,
        numcopies: req.body.numcopies,
        docLanguage: req.body.docLanguage,
    });

    try {
        const newDocument = await document.save();

        res.status(201).json({ newDocument });


    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", getDocById, async(req, res) => {
    try {
        await res.document.remove();
        res.json({ message: "deleted Document" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch("/:id", getDocument, (req, res) => {
    if (req.body.documentType != null) {
        res.document.documentType = req.body.documentType;
    }
    if (req.body.claimedId != null) {
        res.document.claimedId = req.body.claimedId;
    }
    if (req.body.numcopies != null) {
        res.document.numcopies = req.body.numcopies;
    }
    if (req.body.docLanguage != null) {
        res.document.docLanguage = req.body.docLanguage;
    }
    try {
        res.document.save().then((updatedocument) => {
            res.json(updatedocument)

        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

async function getDocument(req, res, next) {
    try {
        document = await Document.find({ claimedId: req.params.claimedId });
        if (document == null) {
            return res.status(404).json({ message: "cannot find document" });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.document = document;
    next();
}

async function getDocByType(req, res, next) {
    try {
        document = await Document.find({type:req.params.type});
        if (document == null) {
            return res.status(404).json({ message: "cannot find " });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.document = document;
    next();
}


async function getDocById(req, res, next) {
    try {
        document = await Document.findById(req.params.id);
        if (document == null) {
            return res.status(404).json({ message: "cannot find " });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.document = document;
    next();
}

module.exports = router;