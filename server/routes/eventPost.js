var express = require("express");
const Event = require("../models/eventPost");
var router = express.Router();
/**
 * @swagger
* tags:
*  name: event
*  description: This is for the main event
* /event:
*  get:
*    tags: [event]
*    description: Use to request all event
*    responses:
*      '200':
*        description: A successful response
*/
router.get("/", async(req, res, next) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get("/bylist", async(req, res, next) => {
    console.log(req.body.list)
    console.log("hello world")
    listId=req.body.list
    console.log(listId[0])
    events=[];
    for(list of listId) {
events.push( await Event.findById(list)
)
    }
    res.json(
events)

    
 
   

  
    

});




router.get("/clubName/:publisheId", async(req, res, next) => {
    try {
        const events = await Event.find({ publisheId: req.params.publisheId });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/id/:id", async(req, res, next) => {
    try {
        const event = await Event.find({ _id: req.params.id });
        res.json(event);
        console.log(event)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
/*
router.get("/eventById/:id", async(req, res, next) => {
    try {
        const events = await Event.find({ id: req.params.id });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
*/


router.get("/:id", getEvent, (req, res) => {
    res.json(res.event);
});

router.post("/", async(req, res, next) => {
    const event = new Event({
        publisheId: req.body.publisheId,
        publishedAt: req.body.publishedAt,
        state: req.body.state,
        type: req.body.type,
        place: req.body.place,
        banner: req.body.banner,
        Time: req.body.Time,
        price: req.body.price,
        description: req.body.description,
        title: req.body.title,
        rate: req.body.rate
    });

    try {
        const newEvent = await event.save();

        res.status(201).json({ newEvent });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", getEvent, async(req, res) => {
    try {
        await res.event.remove();
        res.json({ message: "deleted event" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch("/:id", getEvent, (req, res) => {
    if (req.body.publisheId != null) {
        res.event.publisheId = req.body.publisheId;
    }
    if (req.body.publishedAt != null) {
        res.event.publishedAt = req.body.publishedAt;
    }
    if (req.body.state != null) {
        res.event.state = req.body.state;
    }
    if (req.body.type != null) {
        res.event.type = req.body.type;
    }
    if (req.body.place != null) {
        res.event.place = req.body.place;
    }
    if (req.body.banner != null) {
        res.event.banner = req.body.banner;
    }
    if (req.body.Time != null) {
        res.event.Time = req.body.Time;
    }
    if (req.body.price != null) {
        res.event.price = req.body.price;
    }
    if (req.body.description != null) {
        res.event.description = req.body.description;
    }
    if (req.body.title != null) {
        res.event.title = req.body.title;
    }
    if (req.body.rate != null) {
        res.event.rate = req.body.rate;
    }

    try {
        res.event.save().then((updatedEvent) => {
            res.json(updatedEvent);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



async function getEvent(req, res, next) {
    try {
        event = await Event.findById(req.params.id);
        if (event == null) {
            return res.status(404).json({ message: "cannot find event" });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.event = event;
    next();
}

module.exports = router;