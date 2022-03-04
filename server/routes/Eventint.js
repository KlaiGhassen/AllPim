var express = require("express");
const EventInt = require("../models/EventInt");
var router = express.Router();

router.get("/", async(req, res, next) => {
    try {
        const eventInt = await EventInt.find();
        res.json(eventInt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", getEventInt, (req, res) => {
    res.json(res.eventInt);
});

router.get("/eventIntById/:postId", async(req, res, next) => {
    try {
        const events = await EventInt.find({ postId: req.params.postId });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/eventByUser/:userEmail", async(req, res, next) => {
    try {
        const events = await EventInt.find({ userEmail: req.params.userEmail });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async(req, res, next) => {
    const eventInt = new EventInt({
        userEmail: req.body.userEmail,
        postId: req.body.postId,
    });

    try {
        const newEventInt = await eventInt.save();

        res.status(201).json({ newEventInt });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", getEventInt, async(req, res) => {
    try {
        await res.eventInt.remove();
        res.json({ message: "deleted eventInt" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch("/:id", getEventInt, (req, res) => {
    if (req.body.userEmail != null) {
        res.eventInt.userEmail = req.body.userEmail;
    }
    if (req.body.postId != null) {
        res.eventInt.postId = req.body.postId;
    }
    try {
        res.eventInt.save().then((updatedEventInt) => {
            res.json(updatedEventInt);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

async function getEventInt(req, res, next) {
    try {
        eventInt = await EventInt.findById(req.params.id);
        if (eventInt == null) {
            return res.status(404).json({ message: "cannot find eventInt" });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.eventInt = eventInt;
    next();
}

module.exports = router;