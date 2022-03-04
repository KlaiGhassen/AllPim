var express = require("express");
const Syrveys = require("../models/Syrveys");
var router = express.Router();


//get all syveys
/**
 * @swagger
* tags:
*  name: syveys
*  description: This is for the main syveys
* /syveys:
*  get:
*    tags: [syveys]
*    description: Use to request all syveys
*    responses:
*      '200':
*        description: A successful response
*/
router.get("/", async (req, res, next) => {
  try {
    const syrveys = await Syrveys.find();
    res.json(syrveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
* @swagger
* tags:
*  name: syveys
*  description: This is for the main syveys
* /syveys/{id}:
*  get:
*   tags: [syveys]
*   summary: this Api used to get one syveys from database
*   description: this api is used to get one syveys from database
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

router.get("/:id", getSyrveys , (req, res) => {
  res.json(res.syrveys);
});


/**
* @swagger 
* tags:
*  name: syveys
*  description: This is for the main syveys
* /syveys:
*  post:
*   tags: [syveys]
*   summary: Creates a new syveys.
*   requestBody:
*      content:
*       application/json:
*         schema:
*           type: object
*           properties:
*             publisheId:
*              type: string
*             titre:
*              type: string
*             surveyLink:
*              type: string
*             state:
*              type: boolean
*  responses:
*      201:
*         description: Created
 */


router.post("/", async (req, res, next) => {
  console.log(req.body)
  const syrveys = new Syrveys({
    publisheId:req.body.publisheId,
    titre: req.body.titre,
    surveyLink: req.body.surveyLink,
    state: req.body.state,
  });

  try {
    const newSyrveys = await syrveys.save();

    res.status(201).json({ newSyrveys });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
* @swagger
* tags:
*  name: syveys
*  description: This is for the main syveys
* /syveys/{id}:
*  delete:
*   tags: [syveys]
*   summary: this Api used to delete syveys from database
*   description: this api is used to delete  syveys from database
*   parameters:
*     - in: path
*       name: id
*       description: Must provide  syveys 
*       schema:
*        type: string
*   responses:
*     200:
*        description: A successful response
*/


router.delete("/:id", getSyrveys, async (req, res) => {
  try {
    await res.syrveys.remove();
    res.json({ message: "deleted Syrveys" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/**
* @swagger 
* tags:
*  name: syveys
*  description: This is for the main syveys
* /syveys/{id}:
*  patch:
*   tags: [syveys]
*   summary: Creates a new syveys
*   parameters:
*       - in: path
*         name: id
*         description: id of syveys to change.
*   requestBody:
*       content:
*        application/json:
*          schema:
*            type: object
*            properties:
*              surveyLink:
*               type: string
*              titre:
*               type: string
*              state:
*               type: boolean
*              
*  responses:
*      201:
*         description: Created
 */

router.patch("/:id", getSyrveys, (req, res) => {
  if (req.body.titre != null) {
    res.syrveys.titre = req.body.titre;
  }
  if (req.body.surveyLink != null) {
    res.syrveys.surveyLink = req.body.surveyLink;
  }
  if (req.body.state != null) {
    res.syrveys.state = req.body.state;
  }
  try {
    res.syrveys.save().then((updatedsyrveys) => {
      res.json(updatedsyrveys);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

async function getSyrveys(req, res, next) {
  try {
    syrveys = await Syrveys.findById(req.params.id);
    if (syrveys == null) {
      return res.status(404).json({ message: "cannot find syrveys" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.syrveys = syrveys;
  next();
}

module.exports = router;
