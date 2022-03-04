var express = require("express");
const RatePost = require("../models/ratePost");
var router = express.Router();

/* GET users listing. */
router.get("/", async(req, res, next) => {
    try {
        const ratePost = await RatePost.find();
        res.json(ratePost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/rate/:postId", async(req, res, next) => {
    try {
        const rateposts = await RatePost.find({ postId: req.params.postId });
        res.json(rateposts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
/*
//Post users
router.get("/:claimedId", getRatePost, (req, res) => {
    res.json(res.ratePost);
});
*/

router.post("/", async(req, res, next) => {
    const ratePost = new RatePost({
        postId: req.body.postId,
        userEmail: req.body.userEmail,
        note: req.body.note,
    });

    try {
        const newRatePost = await ratePost.save();

        res.status(201).json({ newRatePost });


    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



async function getRatePost(req, res, next) {
    try {
        ratePost = await RatePost.find({ postId: req.params.postId });
        if (ratePost == null) {
            return res.status(404).json({ message: "cannot find ratePost" });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.ratePost = ratePost;
    next();
}


module.exports = router;