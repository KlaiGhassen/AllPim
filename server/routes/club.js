var express = require("express");
const Club = require("../models/clubs");
var router = express.Router();


//get all syveys

/**
 * @swagger
* tags:
*  name: club
*  description: This is for the main club
* /club:
*  get:
*    tags: [club]
*    description: Use to request all club
*    responses:
*      '200':
*        description: A successful response
*/

router.get("/", async(req, res, next) => {
    try {
        const clubs = await Club.find();
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
* @swagger
* tags:
*  name: club
*  description: This is for the main club
* /club/{clubName}:
*  get:
*   tags: [club]
*   summary: this Api used to get one club from database
*   description: this api is used to get one club from database
*   parameters:
*     - in: path
*       name: clubName
*       description: Must provide  Club name 
*       schema:
*        type: string
*   responses:
*     '200':
*        description: A successful response
*/
router.get("/:clubName", getClub, (req, res) => {
    res.json(res.club);
});

/**
* @swagger
* tags:
*  name: club
*  description: This is for the main club
* /club/clubByLogin/{login}:
*  get:
*   tags: [club]
*   summary: this Api used to get one club from database by login
*   description: this api is used to get one club from database by login
*   parameters:
*     - in: path
*       name: login
*       description: Must provide  Club name 
*       schema:
*        type: string
*   responses:
*     '200':
*        description: A successful response
*/
router.get("/clubByLogin/:login", async(req, res, next) => {
    try {
        const club = await Club.find({ login: req.params.login });
        res.json(club);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
/**
* @swagger
* tags:
*  name: club
*  description: This is for the main club
* /club/clubByName/{clubName}:
*  get:
*   tags: [club]
*   summary: this Api used to get one club from database by clubName
*   description: this api is used to get one club from database by clubName
*   parameters:
*     - in: path
*       name: clubName
*       description: Must provide  Club name 
*       schema:
*        type: string
*   responses:
*     '200':
*        description: A successful response
*/
router.get("/clubByName/:clubName", async(req, res, next) => {
    try {
        const club = await Club.find({ clubName: req.params.clubName });
        res.json(club);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
/**
* @swagger 
* tags:
*  name: club
*  description: This is for the main club
* /club:
*  post:
*   tags: [club]
*   summary: Creates a new club.
*   requestBody:
*      content:
*       application/json:
*         schema:
*           type: object
*           properties:
*             clubName:
*              type: string
*             clubOwner:
*              type: string
*             clubLogo:
*              type: string
*             verified:
*              type: boolean
*             password:
*              type: string
*             login:
*              type: string
*             description:
*              type: string
*             social:
*              type: boolean
*  responses:
*      201:
*         description: Created
*/
router.post("/", async(req, res, next) => {
    console.log(req.body)
    const club = new Club({
        clubName: req.body.clubName,
        clubOwner: req.body.clubOwner,
        clubLogo: req.body.clubLogo,
        verified: req.body.verified,
        password: req.body.password,
        login: req.body.login,
        description: req.body.description,
        social: req.body.social
    });

    try {
        const newClub = await club.save();

        res.status(201).json({ newClub });
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error.message)

    }
});
/**
* @swagger
* tags:
*  name: club
*  description: This is for the main club
* /club/{clubName}:
*  delete:
*   tags: [club]
*   summary: this Api used to delete club from database
*   description: this api is used to delete  club from database
*   parameters:
*     - in: path
*       name: clubName
*       description: Must provide  club 
*       schema:
*        type: string
*   responses:
*     200:
*        description: A successful response
*/
router.delete("/:clubName", getClub, async(req, res) => {
    try {
        await res.club.remove();
        res.json({ message: "deleted club" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
* @swagger 
* tags:
*  name: parking
*  description: This is for the main parking
* /parking/{id}:
*  patch:
*   tags: [parking]
*   summary: Creates a new parking
*   parameters:
*       - in: path
*         name: id
*         description: id of parking to change.
*   requestBody:
*      content:
*       application/json:
*         schema:
*           type: object
*           properties:
*             clubName:
*              type: string
*             clubOwner:
*              type: string
*             clubLogo:
*              type: string
*             verified:
*              type: boolean
*             password:
*              type: string
*             login:
*              type: string
*             description:
*              type: string
*             social:
*              type: boolean
*              
*  responses:
*      201:
*         description: Created
*/


router.patch("/:clubName", getClub, (req, res) => {
    if (req.body.clubName != null) {
        res.club.clubName = req.body.clubName;
    }
    if (req.body.clubOwner != null) {
        res.club.clubOwner = req.body.clubOwner;
    }
    if (req.body.password != null) {
        res.club.password = req.body.password;
    }
    if (req.body.clubLogo != null) {
        res.club.clubLogo = req.body.clubLogo;
    }
    if (req.body.verified != null) {
        res.club.verified = req.body.verified;
    }
    if (req.body.login != null) {
        res.club.login = req.body.login;
    }
    if (req.body.description != null) {
        res.club.description = req.body.description;
    }
    if (req.body.social != null) {
        res.club.social = req.body.social;
    }
    try {
        res.club.save().then((updatedClub) => {
            res.json(updatedClub);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

async function getClub(req, res, next) {
    try {
        club = await Club.find({ clubName: req.params.clubName });
        if (club == null) {
            return res.status(404).json({ message: "cannot find club" });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.club = club[0];
    next();
}

async function getClubById(req, res, next) {
    try {
        club = await Club.findById(req.params.id);
        if (club == null) {
            return res.status(404).json({ message: "cannot find club" });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.club = club;
    next();
}
module.exports = router;