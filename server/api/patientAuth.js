const express = require('express');
const router = express.Router();
const queries = require('../db/patientquery');


router.post("/", (req, res) => {
    try {
        console.log(req.body);
        let email = req.body.email;
        let password = req.body.password;
        console.log(email, password);
        userdb.find({ email: email, password: password }).then((user) => {
            compte = user[0];
            if (compte) {
                let payload = {
                    id: compte.id,
                    role: compte.role,
                };
                console.log(payload);
                const token = jwt.sign(payload, process.env.TOKEN_SECRET);
                let userLogin = {
                    token: token,
                    identifant: compte.identifant,
                    email: compte.email,
                    password: compte.password,
                    phoneNumber: compte.phoneNumber,
                    profilePicture: compte.profilePicture,
                    FirstName: compte.FirstName,
                    LastName: compte.LastName,
                    social: compte.social,
                    role: compte.role,
                    verified: compte.verified,
                    className: compte.className,
                    description: compte.description,
                };
                res.json(userLogin);
            } else {
                res.status(401);
                res.json({
                    error: "UNAUTHORIZED",
                });
            }
        });
    } catch (err) {
        res.json({
            error: err,
        });
    }
});
module.exports = router;
