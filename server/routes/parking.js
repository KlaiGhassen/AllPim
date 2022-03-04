var express = require("express");
const Parking = require("../models/parking");
var router = express.Router();


//get all syveys

/**
 * @swagger
* tags:
*  name: parking
*  description: This is for the main parking
* /parking:
*  get:
*    tags: [parking]
*    description: Use to request all parking
*    responses:
*      '200':
*        description: A successful response
*/

router.get("/", async (req, res, next) => {
  try {
    const parkings = await Parking.find();
    res.json(parkings);
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
*  get:
*   tags: [parking]
*   summary: this Api used to get one parking from database
*   description: this api is used to get one parking from database
*   parameters:
*     - in: path
*       name: id
*       description: Must provide  Id 
*       schema:
*        type: string
*   responses:
*     '200':
*        description: A successful response
*/

router.get("/:id", getParking, (req, res) => {
  res.json(res.parking);
});

/**
* @swagger 
* tags:
*  name: parking
*  description: This is for the main parking
* /parking:
*  post:
*   tags: [parking]
*   summary: Creates a new parking.
*   requestBody:
*      content:
*       application/json:
*         schema:
*           type: object
*           properties:
*             longatitude:
*              type: string
*             latatitude:
*              type: string
*             creted_at:
*              type: string
*             userId:
*              type: string
*  responses:
*      201:
*         description: Created
*/


router.post("/", async (req, res, next) => {
  console.log("",req.body)
  const parking = new Parking({
    longatitude: req.body.longatitude,
    latatitude: req.body.latatitude,
    creted_at: req.body.creted_at,
    userId: req.body.userId,
  });
  console.log("parking",parking)


  try {
    const newParking = await parking.save();

    res.status(201).json({ newParking });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log("parking error", error.message)

  }
});

/**
* @swagger
* tags:
*  name: parking
*  description: This is for the main parking
* /parking/{id}:
*  delete:
*   tags: [parking]
*   summary: this Api used to delete parking from database
*   description: this api is used to delete  parking from database
*   parameters:
*     - in: path
*       name: id
*       description: Must provide  parking 
*       schema:
*        type: string
*   responses:
*     200:
*        description: A successful response
*/

router.delete("/:id", getParking, async (req, res) => {
  try {
    await res.parking.remove();
    res.json({ message: "deleted parking" });
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
*       content:
*        application/json:
*          schema:
*            type: object
*            properties:
*             longatitude:
*              type: string
*             latatitude:
*              type: string
*             creted_at:
*              type: string
*             userId:
*              type: string
*              
*  responses:
*      201:
*         description: Created
 */


router.patch("/:id", getParking, (req, res) => {
  if (req.body.longatitude != null) {
    res.parking.longatitude = req.body.longatitude;
  }
  if (req.body.latatitude != null) {
    res.parking.latatitude = req.body.latatitude;
  }
  if (req.body.creted_at != null) {
    res.parking.creted_at = req.body.creted_at;
  }
  if (req.body.userId != null) {
    res.parking.userId = req.body.userId;
  }

  try {
    res.parking.save().then((updatedParking) => {
      res.json(updatedParking);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

async function getParking(req, res, next) {
  try {
    parking = await Parking.findById(req.params.id);
    if (parking == null) {
      return res.status(404).json({ message: "cannot find parking" });
    }
  } catch (error) {
    return res.status(500).json({ message: err.message });
  }
  res.parking = parking;
  next();
}

module.exports = router;
