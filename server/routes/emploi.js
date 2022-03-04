var express = require("express");
const Emploi = require("../models/emploi");
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
    const emploi = await Emploi.find();
    res.json(emploi);
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

router.get("/:classe", getEmploiByClasse , (req, res) => {
  res.json(res.emploi);
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
  const emploi = new Emploi({
    classe:req.body.classe,
    picture: req.body.picture,
    
  });

  try {
    const newEmploi = await emploi.save();

    res.status(201).json({ newEmploi });
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


router.delete("/:id", getEmploiById, async (req, res) => {
  try {
    await res.emploi.remove();
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

router.patch("/:id", getEmploiById, (req, res) => {
  if (req.body.classe != null) {
    res.emploi.classe = req.body.classe;
  }
  if (req.body.picture != null) {
    res.emploi.picture = req.body.picture;
  }
  try {
    res.syrveys.save().then((updatedsyrveys) => {
      res.json(updatedsyrveys);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

async function getEmploiById(req, res, next) {
    try {
      emploi = await Emploi.findById(req.params.id);
      if (syrveys == null) {
        return res.status(404).json({ message: "cannot find syrveys" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
    res.syrveys = syrveys;
    next();
  }


async function getEmploiByClasse(req, res, next) {
  try {
    emploi = await Emploi.find({"classe" : { $regex: "Info"}});
    if (emploi == null) {
      return res.status(404).json({ message: "cannot find emploi" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.emploi = emploi;
  next();
}

module.exports = router;
