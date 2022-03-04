var express = require("express");
const ClubMembers = require("../models/clubMembers");
var router = express.Router();

router.get("/", async(req, res, next) => {
    try {
        const clubs = await ClubMembers.find();
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get("/join/:state", async(req, res, next) => {
    try {
        const clubs = await ClubMembers.find({ state: req.params.state });
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//.find({ state: req.params.state });

router.get("/findclubbyuser/:userEmail", async(req,res)=>{
    console.log(req.params);

    try {
        const clubs = await ClubMembers.find({ userEmail: req.params.userEmail });
        res.json(clubs);
        console.log(clubs)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }


})



router.get("/:clubName", getClubMembers, (req, res) => {
    res.json(res.club);
});

router.get("/findOne/:id", getOneById, (req, res) => {
    res.json(res.club);
});

router.post("/", async(req, res, next) => {
    const clubMembers = new ClubMembers({
        clubName: req.body.clubName,
        userEmail: req.body.userEmail,
        memberPicture: req.body.memberPicture,
        state: req.body.state
    });

    try {
        const newClubMembers = await clubMembers.save();

        res.status(201).json({ newClubMembers });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch("/:id", getOneById, (req, res) => {
    res.clubMembers.state = true;
    try {
        res.clubMembers.save().then((updatedClubMembers) => {
            res.json(updatedClubMembers);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", getOneById, async(req, res) => {
    try {
        await res.clubMembers.remove();
        res.json({ message: "deleted club" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


async function getJoin(req, res, next) {
    try {
        clubMembers = await ClubMembers.find({ state: req.params.state });
        if (clubMembers == null) {
            return res.status(404).json({ message: "cannot find club" });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.clubMembers = clubMembers;
    console.log(clubMembers);
    next();
}

async function getClubMembers(req, res, next) {
    try {
        clubMembers = await ClubMembers.find({ clubName: req.params.clubName });
        if (clubMembers == null) {
            return res.status(404).json({ message: "cannot find club" });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.clubMembers = clubMembers[0];
    next();
}

async function getOneById(req, res, next) {
    try {
        clubMembers = await ClubMembers.findById(req.params.id);
        if (clubMembers == null) {
            return res.status(404).json({ message: "cannot find " });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.clubMembers = clubMembers;
    next();
}
module.exports = router;