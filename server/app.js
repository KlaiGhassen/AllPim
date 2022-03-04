require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");



const mongoose = require("mongoose");

var emploi = require("./routes/emploi")
var parking = require("./routes/parking");
var clubRouter = require("./routes/club");
var usersRouter = require("./routes/users");
var eventRouter = require("./routes/eventPost");
var elearningRouter = require("./routes/Elearning");
var syrveys = require("./routes/syrveys");
var document = require("./routes/document");
var ratePost = require("./routes/ratePost");
var lostPost = require("./routes/lostPost");
var authUser = require("./routes/auth");
var authClub = require("./routes/authClub");
var EventInt = require("./routes/Eventint");
var admin = require("./routes/admin");
var messages = require("./routes/messages")
var messages = require("./routes/messages");
var uploadDownload = require("./routes/uploadDownload");
var clubMembersRouter = require("./routes/clubMembers");
const swaggerJsDocs = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

var app = express();

// view engine setup

const options = {
    swaggerDefinition: {
        openapi: "3.0.1",
        info: {
          title: "My Endpoints in Pandapp Application",
          version: "1.0.0",
        },
        servers: [
          {
            url: "http://localhost:3000",
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      apis: ["./routes/*.js"],
    };
    const swaggerSpecs = swaggerJsDocs(options);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


    app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//connection to data base
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to DataBase"));


app.use("/upload", uploadDownload);
app.use("/auth", authUser);
app.use("/authClub", authClub);
app.use("/user", usersRouter);
app.use("/club", clubRouter);
app.use("/elearning", elearningRouter);
app.use("/clubMembers", clubMembersRouter);
app.use("/EventInt", EventInt);
app.use("/admin",admin);
app.use("/emploi",emploi);




//app.use(verifyAdminToken);
app.use("/message",messages)
app.use("/ratePost", ratePost);
app.use("/message",messages);

app.use("/event", eventRouter);
//app.use(verifyAdminToken);


app.use("/lostpost", lostPost);
app.use("/document", document);
app.use("/syveys", syrveys);
app.use("/parking", parking);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
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
  console.log("tokenn:", token);
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
