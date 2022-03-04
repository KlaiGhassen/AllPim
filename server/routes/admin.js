const express = require("express");
const router = express.Router();
const queries = require("../db/queries");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");

router.get("/", (req, res) => {
    try {
      
      let user = req.query.user;
      let password = req.query.password;
      queries.authentification(user, password).then((user) => {
          user = user[0];
          console.log("the admin",user)
       
        if (user) {
            console.log(user);
            let payload = user.user;
            console.log(payload);

          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          console.log(token);
          res.json({
            token: token,
            user: user,
          });
        } else {
          res.status(401);
          res.json({
            error: "UNAUTHORIZED",
          });
        }
      });
    } catch (err) {
        console.log("the admin",err);

      res.json({
        error: err,
      });
    }
  });
  
module.exports = router;
