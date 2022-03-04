var express = require("express");
const User = require("../models/user");
var router = express.Router();
const multer = require("multer");
const { POINT_CONVERSION_COMPRESSED } = require("constants");

const picsPath = require("path").resolve(__dirname, "../uploads");

router.get("/download/:nom", function(req, res) {
    let nom = req.params.nom;
    const file = picsPath + "/" + nom;
    console.log(file, "hy");
    res.sendFile(file); // Set disposition and send it.
});

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        var filetype = "";
        var fileExtension = "";
        if (file.mimetype === "image/gif") {
            filetype = "image-";
            fileExtension = "gif";
        }
        if (file.mimetype === "image/png") {
            filetype = "image-";
            fileExtension = "png";
        }
        if (file.mimetype === "image/jpeg") {
            filetype = "image-";
            fileExtension = "jpeg";
        }

        cb(null, filetype + Date.now() + "." + fileExtension);
        h = cb;
    },
});
var upload = multer({
    storage: storage,
});
// download picture to the server
/**
 * @swagger
 * tags:
 *  name: User
 *  description: This is for the main User
 * /user/file:
 *  post:
 *    tags: [User]
 *    summary: Uploads a file.
 *    consumes:
 *      - multipart/form-data
 *    parameters:
 *      - name: file
 *        in: formData   # <-----
 *        description: The uploaded file data
 *        required: true
 *        type: file     # <-----
 * 
 * 
 */

router.post("/file", upload.single("file"), function(req, res, next) {
    if (!req.file) {
        res.status(500);
        return next(err);
    }
    res.json({
        img: req.file.filename,
    });
});

/* GET users listing. */

//get all users
/**
 * @swagger
 * tags:
 *  name: User
 *  description: This is for the main User
 * /user:
 *  get:
 *    tags: [User]
 *    description: Use to request all Users
 *    responses:
 *      '200':
 *        description: A successful response
 */

router.get("/", async(req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// get one user

/**
 * @swagger
 * tags:
 *  name: User
 *  description: This is for the main User
 * /user/{email}:
 *  get:
 *   tags: [User]
 *   summary: this Api used to get one user from database
 *   description: this api is used to get one user from database
 *   parameters:
 *     - in: path
 *       name: email
 *       description: Must provide  email 
 *       schema:
 *        type: string
 *   responses:
 *     '200':
 *        description: A successful response
 */
router.get("/:email", getUser, (req, res) => {
    console.log(res.user)
    res.json(res.user);
});



router.get("/userByEmail/:email", async(req, res, next) => {
    try {
        const user = await User.find({ email: req.params.email });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//add User

/**
 * @swagger 
 * tags:
 *  name: User
 *  description: This is for the main User
 * /user:
 *  post:
 *   tags: [User]
 *   summary: Creates a new user.
 *   requestBody:
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             identifant:
 *              type: string
 *             email:
 *              type: string
 *             password:
 *              type: string
 *             phoneNumber:
 *              type: number
 *             profilePicture:
 *              type: string
 *             FirstName:
 *              type: string
 *             LastName:
 *              type: string
 *             verified:
 *              type: boolean
 *             className:
 *              type: string
 *             social:
 *              type: boolean
 *             role:
 *              type: string
 *             description:
 *              type: string
 *  responses:
 *      201:
 *         description: Created
 */

router.post("/", async(req, res, next) => {
    console.log(req.body);
    const user = new User({
        identifant: req.body.identifant,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        profilePicture: req.body.profilePicture,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        verified: req.body.verified,
        className: req.body.className,
        social: req.body.social,
        role: req.body.role,
        description: req.body.description,
    });
    try {
        const newUser = await user.save();

        res.status(201).json({ newUser });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            res.json({ isemail: true });
        }
    }
});


//delet one user

/**
 * @swagger
 * tags:
 *  name: User
 *  description: This is for the main User
 * /user/{email}:
 *  delete:
 *   tags: [User]
 *   summary: this Api used to delete user from database
 *   description: this api is used to delete  users from database
 *   parameters:
 *     - in: path
 *       name: email
 *       description: Must provide  email 
 *       schema:
 *        type: string
 *   responses:
 *     200:
 *        description: A successful response
 */

router.delete("/:email", getUser, async(req, res) => {
    console.log(res.usery)
    try {
        await res.user.remove();
        res.status(200).json({ message: "deleted user" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



/**
 * @swagger 
 * tags:
 *  name: User
 *  description: This is for the main User
 * /user/{email}:
 *  patch:
 *   tags: [User]
 *   summary: Creates a new user
 *   parameters:
 *       - in: path
 *         name: email
 *         description: email of user to change.
 *   requestBody:
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              identifant:
 *               type: string
 *              email:
 *               type: string
 *              password:
 *               type: string
 *              phoneNumber:
 *               type: number
 *              profilePicture:
 *               type: string
 *              FirstName:
 *               type: string
 *              LastName:
 *               type: string
 *              verified:
 *               type: boolean
 *              className:
 *               type: string
 *              social:
 *               type: boolean
 *              role:
 *               type: string
 *              description:
 *               type: string
 *  responses:
 *      201:
 *         description: Created
 */

router.patch("/:email", getUser, (req, res) => {
    console.log(req.params, req.body)
    if (req.body.identifant != null) {
        res.user.identifant = req.body.identifant;
    }
    if (req.body.email != null) {
        res.user.email = req.body.email;
    }
    if (req.body.password != null) {
        res.user.password = req.body.password;
    }
    if (req.body.phoneNumber != null) {
        res.user.phoneNumber = req.body.phoneNumber;
    }
    if (req.body.profilePicture != null) {
        res.user.profilePicture = req.body.profilePicture;
    }
    if (req.body.FirstName != null) {
        res.user.FirstName = req.body.FirstName;
    }
    if (req.body.LastName != null) {
        res.user.LastName = req.body.LastName;
    }
    if (req.body.verified != null) {
        res.user.verified = req.body.verified;
    }
    if (req.body.social != null) {
        res.user.social = req.body.social;
    }
    if (req.body.role != null) {
        res.user.role = req.body.role;
    }
    if (req.body.description != null) {
        res.user.description = req.body.description;
    }
    if (req.body.className != null) {
        res.user.className = req.body.className;
    }

    try {
        res.user.save().then((updateduser) => {
            res.json(updateduser);
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

async function getUser(req, res, next) {
    console.log(req.params.email)
    try {
        user = await User.find({ email: req.params.email });
        if (user == null) {
            return res.status(404).json({ message: "cannot find user" });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.user = user[0];
    next();
}

module.exports = router;