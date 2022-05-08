require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const mongoose = require("mongoose");
var uploadDownload = require("./routes/uploadDownload");
var authUser = require("./routes/auth");
var appointment = require("./routes/appointement")
var notification = require("./routes/notification")
var ophto = require("./routes/ophto")
var transaction = require("./routes/transaction")
var note = require("./routes/note")
var medicalFollowUp = require("./routes/medicalfollowup")
var patient = require("./routes/patient")
var prescription = require("./routes/prescription");
var ophto = require("./routes/ophto")
var transaction = require("./routes/transaction")
const userRoute = require("./routes/user");
const messageRoute = require("./routes/message");
const authMiddleware = require("./middlewares/auth");
var note = require("./routes/note")
    //const swaggerJsDocs = require("swagger-jsdoc");
    //const swaggerUi = require("swagger-ui-express");
process.env.TZ = 'Europe/Amsterdam';
var app = express();
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Africa/Tunis',

});
console.log(new Date(nDate))
    // view engine setup
    // const options = {
    //     swaggerDefinition: {
    //         openapi: "3.0.1",
    //         info: {
    //           title: "My Endpoints in Pandapp Application",
    //           version: "1.0.0",
    //         },
    //         servers: [
    //           {
    //             url: "http://localhost:3000",
    //           },
    //         ],
    //         components: {
    //           securitySchemes: {
    //             bearerAuth: {
    //               type: "http",
    //               scheme: "bearer",
    //               bearerFormat: "JWT",
    //             },
    //           },
    //         },
    //         security: [
    //           {
    //             bearerAuth: [],
    //           },
    //         ],
    //       },
    //       apis: ["./routes/*.js"],
    //     };
    //     const swaggerSpecs = swaggerJsDocs(options);
    //     app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//connection to data base
//mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
mongoose.connect('mongodb://localhost:27017/pim', { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));

db.once("open", () => console.log("Connected to DataBase"));
app.use("/upload", uploadDownload);


app.use("/auth", authUser);
app.use("/appointement", appointment);
app.use("/notification", notification);
app.use("/ophto", ophto);
app.use("/transaction", transaction);
app.use("/note", note);
app.use("/medicalFollowUp", medicalFollowUp)
app.use("/patient", patient)
app.use("/prescription", prescription)

app.use(authMiddleware);
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.json({
        message: err.message,
        error: req.app.get("env") === "development" ? err : {},
    });
    // render the error page
    res.status(err.status || 500);
});

const jwt = require("jsonwebtoken");

function verifyAdminToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401); // if there isn't any token
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.body["payload"] = user;
        next(); // pass the execution off to whatever request the client intended
    });
}

function verifySuperAdminToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (req.body.payload.role !== 0) return res.sendStatus(401); // user not Super Admin
    next();
}

module.exports = app;