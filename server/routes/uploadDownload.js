var express = require("express");
var router = express.Router();
const multer = require("multer");

const picsPath = require("path").resolve(__dirname, "../uploads");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        console.log()
        var filetype = "";
        var fileExtension = "";
        console.log("file###################################################################", file.mimetype)
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
        if (file.mimetype === "application/pdf") {
            filetype = "pdf-"
            fileExtension = "pdf"

        }

    cb(null, filetype + Date.now() + "." + fileExtension);
    h = cb;
  },
});
var upload = multer({
  storage: storage,
});

router.get("/download/:nom", function (req, res) {
  let nom = req.params.nom;
  const file = picsPath + "/" + nom;
  console.log(file, "hy");
  res.sendFile(file); // Set disposition and send it.
});

router.post("/file", upload.single("file"), function (req, res, next) {
  if (!req.file) {
    res.status(500);
    return next(err);
  }
  res.json({
    img: req.file.filename,
  });
});

module.exports = router;
