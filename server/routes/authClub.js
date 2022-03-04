require("dotenv").config();
const express = require("express");
const clubDb = require("../models/clubs");
const router = express.Router();
var nodloginer = require("nodemailer");

const jwt = require("jsonwebtoken");
var val;
//get one login


/**
 * @swagger
 * tags:
 *  name: auth club User
 *  description: authentification reset verif club User
 * /authclub/reset:
 *  post:
 *      tags: [auth club User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                         
 *      responses:
 *          default:
 *              description: This is the default response for it
 */

router.post("/reset", (req, res) => {
    val = Math.floor(1000 + Math.random() * 9000);
    console.log(val);

    try {
        let login = req.body.login;
        clubDb.find({ login: login }).then((user) => {
            compte = user[0];
            console.log(compte)
            if (compte) {
                var transporter = nodloginer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "pimmpim40@gmail.com",
                        pass: "123456789azer@@",
                    },
                });
                var mailOptions = {
                    from: "pimmpim40@gmail.com",
                    to: compte.login,
                    subject: "Reset password",
                    html: templateReset(val),

                    attachments: [{
                            filename: "final_panda_ios.png",
                            path: "./final_panda_ios.png",
                            cid: 'pandaplogo.ee'
                        },

                    ],
                };
                transporter.sendMail(mailOptions, async function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });

                res.json({
                    islogin: true,
                });
            } else {
                res.json({
                    islogin: false,
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
});

/**
 * @swagger
 * tags:
 *  name: auth club User
 *  description: authentification reset verif club User
 * /authclub/verified:
 *  post:
 *      tags: [auth club User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                         
 *      responses:
 *          default:
 *              description: This is the default response for it
 */
router.post("/verified", (req, res) => {
    val = Math.floor(1000 + Math.random() * 9000);
    console.log(val);

    try {
        let login = req.body.login;
        clubDb.find({ login: login }).then((user) => {
            compte = user[0];
            if (compte) {
                var transporter = nodloginer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "pimmpim40@gmail.com",
                        pass: "123456789azer@@",
                    },
                });
                var mailOptions = {
                    from: "pimmpim40@gmail.com",
                    to: compte.login,
                    subject: "Reset password",
                    html: templateVerify(val),
                    attachments: [{
                            filename: "final_panda_ios.png",
                            path: "./final_panda_ios.png",
                            cid: 'pandaplogo.ee'
                        },

                    ],
                };
                transporter.sendMail(mailOptions, async function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });

                res.json({
                    islogin: true,
                });
            } else {
                res.json({
                    islogin: false,
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
});


/**
 * @swagger
 * tags:
 *  name: auth club User
 *  description: authentification reset verif club User
 * /authclub/verified:
 *  patch:
 *      tags: [auth club User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          code:
 *                              type: number
 *                         
 *      responses:
 *          default:
 *              description: This is the default response for it
 */
router.patch("/verified", getClubByEmail, async(req, res) => {
    if (req.body.code == val) {
        res.club.verified = true
    }
    try {
        res.club.save().then((updateduser) => {
            res.json(
                updateduser
            );
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

});

/**
 * @swagger
 * tags:
 *  name: auth club User
 *  description: authentification reset verif club User
 * /authclub/socauth:
 *  post:
 *      tags: [auth club User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *                         
 *      responses:
 *          default:
 *              description: This is the default response for it
 */
router.post("/socauth", (req, res) => {
    try {
        let newUser = new clubDb({
            nom: req.body.nom,
            login: req.body.login,
            prenom: req.body.prenom,
            image: req.body.image,
            description: req.body.description,
            social: true,
            verified: true,
        });
        clubDb.find({ login: newUser.login }).then((club) => {
            ss = club[0];
            console.log(ss);
            if (ss) {
                let payload = {
                    id: ss.id,
                    role: ss.clubOwner,
                };
                const token = jwt.sign(payload, process.env.TOKEN_SECRET);
                res.json({
                    token: token,
                    user: ss,
                });
            } else {
                newUser.save().then((user) => {
                    console.log("hello", user);
                    compte = user;
                    if (compte) {
                        let payload = {
                            id: compte.id,
                            role: compte.clubOwner,
                        };
                        console.log(payload);
                        const token = jwt.sign(payload, process.env.TOKEN_SECRET);
                        console.log("hello", compte);

                        res.json({
                            token: token,
                            user: compte,
                        });
                    } else {
                        res.status(401);
                        res.json({
                            error: "UNAUTHORIZED",
                        });
                    }
                });
            }
        });
    } catch (err) {
        console.log(err.code);
        if (err.code === 11000) {
            res.json({ created: true });
        }
    }
});


/**
 * @swagger
 * tags:
 *  name: auth club User
 *  description: authentification reset verif club User
 * /authclub:
 *  post:
 *      tags: [auth club User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *                         
 *      responses:
 *          default:
 *              description: This is the default response for it
 */
router.post("/", (req, res) => {
    try {
        console.log(req.body);
        let login = req.body.login;
        let password = req.body.password;
        console.log(login, password);
        clubDb.find({ login: login, password: password }).then((Club) => {
            compte = Club[0];
            if (compte) {
                let payload = {
                    id: compte.id,
                    role: compte.clubOwner,
                };
                console.log(payload);
                const token = jwt.sign(payload, process.env.TOKEN_SECRET);
                let clubLogin = {
                    tokenClub: token,
                    clubName: compte.clubName,
                    clubOwner: compte.clubOwner,
                    password: compte.password,
                    clubLogo: compte.clubLogo,
                    description: compte.description,
                    verified: compte.verified,
                    login: compte.login
                };
                res.json(clubLogin);
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

router.post("/googleCheck", (req, res) => {
    try {
        console.log(req.body);
        let login = req.body.login;
        console.log(login);
        clubDb.find({ login: login }).then((Club) => {
            compte = Club[0];
            if (compte) {
                let payload = {
                    id: compte.id,
                    role: compte.clubOwner,
                };
                console.log(payload);
                const token = jwt.sign(payload, process.env.TOKEN_SECRET);
                let clubLogin = {
                    tokenClub: token,
                    clubName: compte.clubName,
                    clubOwner: compte.clubOwner,
                    password: compte.password,
                    clubLogo: compte.clubLogo,
                    description: compte.description,
                    verified: compte.verified,
                    login: compte.login
                };
                res.json(clubLogin);
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

/**
 * @swagger
 * tags:
 *  name: auth club User
 *  description: authentification reset verif club User
 * /authclub/reset:
 *  patch:
 *      tags: [auth club User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          code:
 *                              type: number
 *                          password:
 *                              type: number
 *                         
 *      responses:
 *          default:
 *              description: This is the default response for it
 */
router.patch("/reset", getClubByEmail, async(req, res) => {
    if (req.body.password != null) {
        if (req.body.code == val) {
            res.club.password = req.body.password;
        }
        try {
            res.club.save().then((updateduser) => {
                res.json(
                    updateduser
                );
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    } else {
        res.json({ code: false });
    }
});

async function getClubByEmail(req, res, next) {
    try {
        club = await clubDb.find({ login: req.body.login });
        if (club == null) {
            return res.status(404).json({ message: "cannot find user" });
        }
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
    res.club = club[0];
    next();
}

function templateReset(val) {
    return `
  <!DOCTYPE html >
  <html>
  
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Facebook sharing information tags -->
    <meta property="og:title" content="Reset Your Password">
    <title>Reset Your password</title>
    <style type="text/css">
      #outlook a{
          padding:0;
        }
        body{
          width:100% !important;
        }
        .ReadMsgBody{
          width:100%;
        }
        .ExternalClass{
          width:100%;
        }
        body{
          -webkit-text-size-adjust:none;
        }
        body{
          margin:0;
          padding:0;
        }
        img{
          border:0;
          height:auto;
          line-height:100%;
          outline:none;
          text-decoration:none;
        }
        table td{
          border-collapse:collapse;
        }
        #backgroundTable{
          height:100% !important;
          margin:0;
          padding:0;
          width:100% !important;
        }
      /*
      @tab Page
      @section background color
      @tip Set the background color for your login. You may want to choose one that matches your company's branding.
      @theme page
      */
        body,#backgroundTable{
          /*@editable*/background-color:#FAFAFA;
        }
      /*
      @tab Page
      @section login border
      @tip Set the border for your login.
      */
        #templateContainer{
          /*@editable*/border:1px none #DDDDDD;
        }
      /*
      @tab Page
      @section heading 1
      @tip Set the styling for all first-level headings in your logins. These should be the largest of your headings.
      @style heading 1
      */
        h1,.h1{
          /*@editable*/color:#202020;
          display:block;
          /*@editable*/font-family:Arial;
          /*@editable*/font-size:24px;
          /*@editable*/font-weight:bold;
          /*@editable*/line-height:100%;
          margin-top:20px;
          margin-right:0;
          margin-bottom:20px;
          margin-left:0;
          /*@editable*/text-align:center;
        }
      /*
      @tab Page
      @section heading 2
      @tip Set the styling for all second-level headings in your logins.
      @style heading 2
      */
        h2,.h2{
          /*@editable*/color:#202020;
          display:block;
          /*@editable*/font-family:Arial;
          /*@editable*/font-size:30px;
          /*@editable*/font-weight:bold;
          /*@editable*/line-height:100%;
          margin-top:0;
          margin-right:0;
          margin-bottom:10px;
          margin-left:0;
          /*@editable*/text-align:center;
        }
      /*
      @tab Page
      @section heading 3
      @tip Set the styling for all third-level headings in your logins.
      @style heading 3
      */
        h3,.h3{
          /*@editable*/color:#202020;
          display:block;
          /*@editable*/font-family:Arial;
          /*@editable*/font-size:26px;
          /*@editable*/font-weight:bold;
          /*@editable*/line-height:100%;
          margin-top:0;
          margin-right:0;
          margin-bottom:10px;
          margin-left:0;
          /*@editable*/text-align:center;
        }
      /*
      @tab Page
      @section heading 4
      @tip Set the styling for all fourth-level headings in your logins. These should be the smallest of your headings.
      @style heading 4
      */
        h4,.h4{
          /*@editable*/color:#202020;
          display:block;
          /*@editable*/font-family:Arial;
          /*@editable*/font-size:22px;
          /*@editable*/font-weight:bold;
          /*@editable*/line-height:100%;
          margin-top:0;
          margin-right:0;
          margin-bottom:10px;
          margin-left:0;
          /*@editable*/text-align:center;
        }
      /*
      @tab Header
      @section preheader style
      @tip Set the background color for your login's preheader area.
      @theme page
      */
        #templatePreheader{
          /*@editable*/background-color:#FAFAFA;
        }
      /*
      @tab Header
      @section preheader text
      @tip Set the styling for your login's preheader text. Choose a size and color that is easy to read.
      */
        .preheaderContent div{
          /*@editable*/color:#505050;
          /*@editable*/font-family:Arial;
          /*@editable*/font-size:10px;
          /*@editable*/line-height:100%;
          /*@editable*/text-align:left;
        }
      /*
      @tab Header
      @section preheader link
      @tip Set the styling for your login's preheader links. Choose a color that helps them stand out from your text.
      */
        .preheaderContent div a:link,.preheaderContent div a:visited,.preheaderContent div a .yshortcuts {
          /*@editable*/color:#336699;
          /*@editable*/font-weight:normal;
          /*@editable*/text-decoration:underline;
        }
        .preheaderContent img{
          display:inline;
          height:auto;
          margin-bottom:10px;
          max-width:280px;
        }
      /*
      @tab Header
      @section header style
      @tip Set the background color and border for your login's header area.
      @theme header
      */
        #templateHeader{
          /*@editable*/background-color:#FFFFFF;
          /*@editable*/border-bottom:0;
        }
      /*
      @tab Header
      @section header text
      @tip Set the styling for your login's header text. Choose a size and color that is easy to read.
      */
        .headerContent{
          /*@editable*/color:#202020;
          /*@editable*/font-family:Arial;
          /*@editable*/font-size:34px;
          /*@editable*/font-weight:bold;
          /*@editable*/line-height:100%;
          /*@editable*/padding:0;
          /*@editable*/text-align:left;
          /*@editable*/vertical-align:middle;
          background-color: #FAFAFA;
            padding-bottom: 14px;
        }
      /*
      @tab Header
      @section header link
      @tip Set the styling for your login's header links. Choose a color that helps them stand out from your text.
      */
        .headerContent a:link,.headerContent a:visited,.headerContent a .yshortcuts {
          /*@editable*/color:#336699;
          /*@editable*/font-weight:normal;
          /*@editable*/text-decoration:underline;
        }
        #headerImage{
          height:auto;
          max-width:400px !important;
        }
      /*
      @tab Body
      @section body style
      @tip Set the background color for your login's body area.
      */
        #templateContainer,.bodyContent{
          /*@editable*/background-color:#FFFFFF;
        }
      /*
      @tab Body
      @section body text
      @tip Set the styling for your login's main content text. Choose a size and color that is easy to read.
      @theme main
      */
        .bodyContent div{
          /*@editable*/color:#505050;
          /*@editable*/font-family:Arial;
          /*@editable*/font-size:14px;
          /*@editable*/line-height:150%;
          /*@editable*/text-align:left;
        }
      /*
      @tab Body
      @section body link
      @tip Set the styling for your login's main content links. Choose a color that helps them stand out from your text.
      */
        .bodyContent div a:link,.bodyContent div a:visited,.bodyContent div a .yshortcuts {
          /*@editable*/color:#336699;
          /*@editable*/font-weight:normal;
          /*@editable*/text-decoration:underline;
        }
        .bodyContent img{
          display:inline;
          height:auto;
          margin-bottom:10px;
          max-width:280px;
        }
      /*
      @tab Footer
      @section footer style
      @tip Set the background color and top border for your login's footer area.
      @theme footer
      */
        #templateFooter{
          /*@editable*/background-color:#FFFFFF;
          /*@editable*/border-top:0;
        }
      /*
      @tab Footer
      @section footer text
      @tip Set the styling for your login's footer text. Choose a size and color that is easy to read.
      @theme footer
      */
        .footerContent {
          background-color: #fafafa;
        }
        .footerContent div{
          /*@editable*/color:#707070;
          /*@editable*/font-family:Arial;
          /*@editable*/font-size:11px;
          /*@editable*/line-height:150%;
          /*@editable*/text-align:left;
        }
      /*
      @tab Footer
      @section footer link
      @tip Set the styling for your login's footer links. Choose a color that helps them stand out from your text.
      */
        .footerContent div a:link,.footerContent div a:visited,.footerContent div a .yshortcuts {
          /*@editable*/color:#336699;
          /*@editable*/font-weight:normal;
          /*@editable*/text-decoration:underline;
        }
        .footerContent img{
          display:inline;
        }
      /*
      @tab Footer
      @section social bar style
      @tip Set the background color and border for your login's footer social bar.
      @theme footer
      */
        #social{
          /*@editable*/background-color:#FAFAFA;
          /*@editable*/border:0;
        }
      /*
      @tab Footer
      @section social bar style
      @tip Set the background color and border for your login's footer social bar.
      */
        #social div{
          /*@editable*/text-align:left;
        }
      /*
      @tab Footer
      @section utility bar style
      @tip Set the background color and border for your login's footer utility bar.
      @theme footer
      */
        #utility{
          /*@editable*/background-color:#FFFFFF;
          /*@editable*/border:0;
        }
      /*
      @tab Footer
      @section utility bar style
      @tip Set the background color and border for your login's footer utility bar.
      */
        #utility div{
          /*@editable*/text-align:left;
        }
        #monkeyRewards img{
          display:inline;
          height:auto;
          max-width:280px;
        }
    
    
      /*
      ATAVIST CUSTOM STYLES 
       */
    
      .buttonText {
        color: #4A90E2;
        text-decoration: none;
        font-weight: normal;
        display: block;
        border: 2px solid #585858;
        padding: 10px 80px;
        font-family: Arial;
      }
    
      #supportSection, .supportContent {
        background-color: white;
        font-family: arial;
        font-size: 12px;
        border-top: 1px solid #e4e4e4;
      }
    
      .bodyContent table {
        padding-bottom: 10px;
      }
    
    
      .footerContent p {
        margin: 0;
        margin-top: 2px;
      }
    
      .headerContent.centeredWithBackground {
        background-color: #F4EEE2;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
      }
          
       @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
              h1 {
                  font-size: 40px !important;
              }
              
              .content {
                  font-size: 22px !important;
              }
              
              .bodyContent p {
                  font-size: 22px !important;
              }
              
              .buttonText {
                  font-size: 22px !important;
              }
              
              p {
                  
                  font-size: 16px !important;
                  
              }
              
              .footerContent p {
                  padding-left: 5px !important;
              }
              
              .mainContainer {
                  padding-bottom: 0 !important;   
              }
          }
    </style>
  </head>
  
  <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="width:100% ;-webkit-text-size-adjust:none;margin:0;padding:0;background-color:#FAFAFA;">
    <center>
      <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="backgroundTable" style="height:100% ;margin:0;padding:0;width:100% ;background-color:#FAFAFA;">
        <tr>
          <td align="center" valign="top" style="border-collapse:collapse;">
            <!-- // Begin Template Preheader \\ -->
            <table border="0" cellpadding="10" cellspacing="0" width="450" id="templatePreheader" style="background-color:#FAFAFA;">
              <tr>
                <td valign="top" class="preheaderContent" style="border-collapse:collapse;">
                  <!-- // Begin Module: Standard Preheader \\ -->
                  <table border="0" cellpadding="10" cellspacing="0" width="100%">
                    <tr>
                      <td valign="top" style="border-collapse:collapse;">
                        <!-- <div mc:edit="std_preheader_content">
                                                       Use this area to offer a short teaser of your login's content. Text here will show in the preview area of some login clients.
                                                    </div>
                                                    -->
                      </td>
                    </tr>
                  </table>
                  <!-- // End Module: Standard Preheader \\ -->
                </td>
              </tr>
            </table>
            <!-- // End Template Preheader \\ -->
            <table border="0" cellpadding="0" cellspacing="0" width="450" id="templateContainer" style="border:1px none #DDDDDD;background-color:#FFFFFF;">
              <tr>
                <td align="center" valign="top" style="border-collapse:collapse;">
                  <!-- // Begin Template Header \\ -->
                  <table border="0" cellpadding="0" cellspacing="0" width="450" id="templateHeader" style="background-color:#FFFFFF;border-bottom:0;">
                    <tr>
                      <td class="headerContent centeredWithBackground" style="border-collapse:collapse;color:#202020;font-family:Arial;font-size:34px;font-weight:bold;line-height:100%;padding:0;text-align:center;vertical-align:middle;background-color:#F4EEE2;padding-bottom:20px;padding-top:20px;">
                        <!-- // Begin Module: Standard Header Image \\ -->
                        <img width="130" src="cid:pandaplogo.ee" id="headerImage campaign-icon">
                        <!-- // End Module: Standard Header Image \\ -->
                     
                      
                    </tr>
                  </table>
                  <!-- // End Template Header \\ -->
                </td>
              </tr>
              <tr>
                <td align="center" valign="top" style="border-collapse:collapse;">
                  <!-- // Begin Template Body \\ -->
                  <table border="0" cellpadding="0" cellspacing="0" width="450" id="templateBody">
                    <tr>
                      <td valign="top" class="bodyContent" style="border-collapse:collapse;background-color:#FFFFFF;">
                        <!-- // Begin Module: Standard Content \\ -->
                        <table border="0" cellpadding="12" cellspacing="0" width="100%" style="padding-bottom:10px;">
                          <tr>
                            <td valign="top" style="padding-bottom:1rem;border-collapse:collapse;" class="mainContainer">
                              <div style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                <h1 class="h1" style="color:#202020;display:block;font-family:Arial;font-size:24px;font-weight:bold;line-height:100%;margin-top:20px;margin-right:0;margin-bottom:20px;margin-left:0;text-align:center;">Reset Your Password</h1>
                                <p>Reset code : </p>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="border-collapse:collapse;">
                              <table border="0" cellpadding="0" cellspacing="0" style="padding-bottom:10px;">
                                <tbody>
                                  <tr align="center">
                                    <td align="center" valign="middle" style="border-collapse:collapse;">
                                      <p class="buttonText" href="#" target="_blank" style="color: #4A90E2;text-decoration: none;font-weight: normal;display: block;border: 2px solid #585858;padding: 10px 60px;font-family: Arial;">${val}</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!-- // End Module: Standard Content \\ -->
                      </td>
                    </tr>
                  </table>
                  <!-- // End Template Body \\ -->
                </td>
              </tr>
              <tr>
                <td align="center" valign="top" style="border-collapse:collapse;">
                  <!-- // Begin Support Section \\ -->
                  <table border="0" cellpadding="10" cellspacing="0" width="450" id="supportSection" style="background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                    <tr>
                      <td valign="top" class="supportContent" style="border-collapse:collapse;background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                        <!-- // Begin Module: Standard Footer \\ -->
                        <table border="0" cellpadding="10" cellspacing="0" width="100%">
                          <tr>
                            <td valign="top" width="100%" style="border-collapse:collapse;">
                              <br>
                              <div style="text-align: center; color: #c9c9c9;">
                                <p>Questions? Get your answers here:&nbsp;
                                pimmpim40@gmail.com .</p>
                              </div>
                              <br>
                            </td>
                          </tr>
                        </table>
                        <!-- // End Module: Standard Footer \\ -->
                      </td>
                    </tr>
                  </table>
                  <!-- // Begin Support Section \\ -->
                </td>
              </tr>
              <tr>
                <td align="center" valign="top" style="border-collapse:collapse;">
                  <!-- // Begin Template Footer \\ -->
                  <table border="0" cellpadding="10" cellspacing="0" width="450" id="templateFooter" style="background-color:#FFFFFF;border-top:0;">
                    <tr>
                      <td valign="top" class="footerContent" style="padding-left:0;border-collapse:collapse;background-color:#fafafa;">
                        <div style="text-align:center;color:#c9c9c9;font-family:Arial;font-size:11px;line-height:150%;">
                          <p style="text-align:left;margin:0;margin-top:2px;">Pandapp | Tunisie, Ariana , 3200 | Copyright © 2021 | All rights reserved</p>
                        </div>
                        <!-- // End Module: Standard Footer \\ -->
                      </td>
                    </tr>
                  </table>
                  <!-- // End Template Footer \\ -->
                </td>
              </tr>
            </table>
            <br>
          </td>
        </tr>
      </table>
    </center>
  </body>
  
  </html>
  
  `
}

function templateVerify(val) {
    return `
  <!DOCTYPE html >
  <html>
  
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Facebook sharing information tags -->
    <meta property="og:title" content="Verify Your Email">
    <title>Verify Your Email</title>
    <style type="text/css">
      #outlook a{
          padding:0;
        }
        body{
          width:100% !important;
        }
        .ReadMsgBody{
          width:100%;
        }
        .ExternalClass{
          width:100%;
        }
        body{
          -webkit-text-size-adjust:none;
        }
        body{
          margin:0;
          padding:0;
        }
        img{
          border:0;
          height:auto;
          line-height:100%;
          outline:none;
          text-decoration:none;
        }
        table td{
          border-collapse:collapse;
        }
        #backgroundTable{
          height:100% !important;
          margin:0;
          padding:0;
          width:100% !important;
        }
      /*
      @tab Page
      @section background color
      @tip Set the background color for your login. You may want to choose one that matches your company's branding.
      @theme page
      */
        body,#backgroundTable{
          /*@editable*/background-color:#FAFAFA;
        }
      /*
      @tab Page
      @section login border
      @tip Set the border for your login.
      */
        #templateContainer{
          /*@editable*/border:1px none #DDDDDD;
        }
      /*
      @tab Page
      @section heading 1
      @tip Set the styling for all first-level headings in your logins. These should be the largest of your headings.
      @style heading 1
      */
        h1,.h1{
          /*@editable*/color:#202020;
          display:block;
          /*@editable*/font-family:Arial;
          /*@editable*/font-size:24px;
          /*@editable*/font-weight:bold;
          /*@editable*/line-height:100%;
          margin-top:20px;
          margin-right:0;
          margin-bottom:20px;
          margin-left:0;
          /*@editable*/text-align:center;
        }
      /*
      @tab Page
      @section heading 2
      @tip Set the styling for all second-level headings in your logins.
      @style heading 2
      */
        h2,.h2{
          /*@editable*/color:#202020;
          display:block;
          /*@editable*/font-family:Arial;
          /*@editable*/font-size:30px;
          /*@editable*/font-weight:bold;
          /*@editable*/line-height:100%;
          margin-top:0;
          margin-right:0;
          margin-bottom:10px;
          margin-left:0;
          /*@editable*/text-align:center;
        }
      /*
      @tab Page
      @section heading 3
      @tip Set the styling for all third-level headings in your logins.
      @style heading 3
      */
        h3,.h3{
          /*@editable*/color:#202020;
          display:block;
          /*@editable*/font-family:Arial;
          /*@editable*/font-size:26px;
          /*@editable*/font-weight:bold;
          /*@editable*/line-height:100%;
          margin-top:0;
          margin-right:0;
          margin-bottom:10px;
          margin-left:0;
          /*@editable*/text-align:center;
        }
      /*
      @tab Page
      @section heading 4
      @tip Set the styling for all fourth-level headings in your logins. These should be the smallest of your headings.
      @style heading 4
      */
        h4,.h4{
          /*@editable*/color:#202020;
          display:block;
          /*@editable*/font-family:Arial;
          /*@editable*/font-size:22px;
          /*@editable*/font-weight:bold;
          /*@editable*/line-height:100%;
          margin-top:0;
          margin-right:0;
          margin-bottom:10px;
          margin-left:0;
          /*@editable*/text-align:center;
        }
      /*
      @tab Header
      @section preheader style
      @tip Set the background color for your login's preheader area.
      @theme page
      */
        #templatePreheader{
          /*@editable*/background-color:#FAFAFA;
        }
      /*
      @tab Header
      @section preheader text
      @tip Set the styling for your login's preheader text. Choose a size and color that is easy to read.
      */
        .preheaderContent div{
          /*@editable*/color:#505050;
          /*@editable*/font-family:Arial;
          /*@editable*/font-size:10px;
          /*@editable*/line-height:100%;
          /*@editable*/text-align:left;
        }
      /*
      @tab Header
      @section preheader link
      @tip Set the styling for your login's preheader links. Choose a color that helps them stand out from your text.
      */
        .preheaderContent div a:link,.preheaderContent div a:visited,.preheaderContent div a .yshortcuts {
          /*@editable*/color:#336699;
          /*@editable*/font-weight:normal;
          /*@editable*/text-decoration:underline;
        }
        .preheaderContent img{
          display:inline;
          height:auto;
          margin-bottom:10px;
          max-width:280px;
        }
      /*
      @tab Header
      @section header style
      @tip Set the background color and border for your login's header area.
      @theme header
      */
        #templateHeader{
          /*@editable*/background-color:#FFFFFF;
          /*@editable*/border-bottom:0;
        }
      /*
      @tab Header
      @section header text
      @tip Set the styling for your login's header text. Choose a size and color that is easy to read.
      */
        .headerContent{
          /*@editable*/color:#202020;
          /*@editable*/font-family:Arial;
          /*@editable*/font-size:34px;
          /*@editable*/font-weight:bold;
          /*@editable*/line-height:100%;
          /*@editable*/padding:0;
          /*@editable*/text-align:left;
          /*@editable*/vertical-align:middle;
          background-color: #FAFAFA;
            padding-bottom: 14px;
        }
      /*
      @tab Header
      @section header link
      @tip Set the styling for your login's header links. Choose a color that helps them stand out from your text.
      */
        .headerContent a:link,.headerContent a:visited,.headerContent a .yshortcuts {
          /*@editable*/color:#336699;
          /*@editable*/font-weight:normal;
          /*@editable*/text-decoration:underline;
        }
        #headerImage{
          height:auto;
          max-width:400px !important;
        }
      /*
      @tab Body
      @section body style
      @tip Set the background color for your login's body area.
      */
        #templateContainer,.bodyContent{
          /*@editable*/background-color:#FFFFFF;
        }
      /*
      @tab Body
      @section body text
      @tip Set the styling for your login's main content text. Choose a size and color that is easy to read.
      @theme main
      */
        .bodyContent div{
          /*@editable*/color:#505050;
          /*@editable*/font-family:Arial;
          /*@editable*/font-size:14px;
          /*@editable*/line-height:150%;
          /*@editable*/text-align:left;
        }
      /*
      @tab Body
      @section body link
      @tip Set the styling for your login's main content links. Choose a color that helps them stand out from your text.
      */
        .bodyContent div a:link,.bodyContent div a:visited,.bodyContent div a .yshortcuts {
          /*@editable*/color:#336699;
          /*@editable*/font-weight:normal;
          /*@editable*/text-decoration:underline;
        }
        .bodyContent img{
          display:inline;
          height:auto;
          margin-bottom:10px;
          max-width:280px;
        }
      /*
      @tab Footer
      @section footer style
      @tip Set the background color and top border for your login's footer area.
      @theme footer
      */
        #templateFooter{
          /*@editable*/background-color:#FFFFFF;
          /*@editable*/border-top:0;
        }
      /*
      @tab Footer
      @section footer text
      @tip Set the styling for your login's footer text. Choose a size and color that is easy to read.
      @theme footer
      */
        .footerContent {
          background-color: #fafafa;
        }
        .footerContent div{
          /*@editable*/color:#707070;
          /*@editable*/font-family:Arial;
          /*@editable*/font-size:11px;
          /*@editable*/line-height:150%;
          /*@editable*/text-align:left;
        }
      /*
      @tab Footer
      @section footer link
      @tip Set the styling for your login's footer links. Choose a color that helps them stand out from your text.
      */
        .footerContent div a:link,.footerContent div a:visited,.footerContent div a .yshortcuts {
          /*@editable*/color:#336699;
          /*@editable*/font-weight:normal;
          /*@editable*/text-decoration:underline;
        }
        .footerContent img{
          display:inline;
        }
      /*
      @tab Footer
      @section social bar style
      @tip Set the background color and border for your login's footer social bar.
      @theme footer
      */
        #social{
          /*@editable*/background-color:#FAFAFA;
          /*@editable*/border:0;
        }
      /*
      @tab Footer
      @section social bar style
      @tip Set the background color and border for your login's footer social bar.
      */
        #social div{
          /*@editable*/text-align:left;
        }
      /*
      @tab Footer
      @section utility bar style
      @tip Set the background color and border for your login's footer utility bar.
      @theme footer
      */
        #utility{
          /*@editable*/background-color:#FFFFFF;
          /*@editable*/border:0;
        }
      /*
      @tab Footer
      @section utility bar style
      @tip Set the background color and border for your login's footer utility bar.
      */
        #utility div{
          /*@editable*/text-align:left;
        }
        #monkeyRewards img{
          display:inline;
          height:auto;
          max-width:280px;
        }
    
    
      /*
      ATAVIST CUSTOM STYLES 
       */
    
      .buttonText {
        color: #4A90E2;
        text-decoration: none;
        font-weight: normal;
        display: block;
        border: 2px solid #585858;
        padding: 10px 80px;
        font-family: Arial;
      }
    
      #supportSection, .supportContent {
        background-color: white;
        font-family: arial;
        font-size: 12px;
        border-top: 1px solid #e4e4e4;
      }
    
      .bodyContent table {
        padding-bottom: 10px;
      }
    
    
      .footerContent p {
        margin: 0;
        margin-top: 2px;
      }
    
      .headerContent.centeredWithBackground {
        background-color: #F4EEE2;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
      }
          
       @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
              h1 {
                  font-size: 40px !important;
              }
              
              .content {
                  font-size: 22px !important;
              }
              
              .bodyContent p {
                  font-size: 22px !important;
              }
              
              .buttonText {
                  font-size: 22px !important;
              }
              
              p {
                  
                  font-size: 16px !important;
                  
              }
              
              .footerContent p {
                  padding-left: 5px !important;
              }
              
              .mainContainer {
                  padding-bottom: 0 !important;   
              }
          }
    </style>
  </head>
  
  <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="width:100% ;-webkit-text-size-adjust:none;margin:0;padding:0;background-color:#FAFAFA;">
    <center>
      <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="backgroundTable" style="height:100% ;margin:0;padding:0;width:100% ;background-color:#FAFAFA;">
        <tr>
          <td align="center" valign="top" style="border-collapse:collapse;">
            <!-- // Begin Template Preheader \\ -->
            <table border="0" cellpadding="10" cellspacing="0" width="450" id="templatePreheader" style="background-color:#FAFAFA;">
              <tr>
                <td valign="top" class="preheaderContent" style="border-collapse:collapse;">
                  <!-- // Begin Module: Standard Preheader \\ -->
                  <table border="0" cellpadding="10" cellspacing="0" width="100%">
                    <tr>
                      <td valign="top" style="border-collapse:collapse;">
                        <!-- <div mc:edit="std_preheader_content">
                                                       Use this area to offer a short teaser of your login's content. Text here will show in the preview area of some login clients.
                                                    </div>
                                                    -->
                      </td>
                    </tr>
                  </table>
                  <!-- // End Module: Standard Preheader \\ -->
                </td>
              </tr>
            </table>
            <!-- // End Template Preheader \\ -->
            <table border="0" cellpadding="0" cellspacing="0" width="450" id="templateContainer" style="border:1px none #DDDDDD;background-color:#FFFFFF;">
              <tr>
                <td align="center" valign="top" style="border-collapse:collapse;">
                  <!-- // Begin Template Header \\ -->
                  <table border="0" cellpadding="0" cellspacing="0" width="450" id="templateHeader" style="background-color:#FFFFFF;border-bottom:0;">
                    <tr>
                      <td class="headerContent centeredWithBackground" style="border-collapse:collapse;color:#202020;font-family:Arial;font-size:34px;font-weight:bold;line-height:100%;padding:0;text-align:center;vertical-align:middle;background-color:#F4EEE2;padding-bottom:20px;padding-top:20px;">
                        <!-- // Begin Module: Standard Header Image \\ -->
                        <img width="130" src="cid:pandaplogo.ee" id="headerImage campaign-icon">
                        <!-- // End Module: Standard Header Image \\ -->
                     
                      
                    </tr>
                  </table>
                  <!-- // End Template Header \\ -->
                </td>
              </tr>
              <tr>
                <td align="center" valign="top" style="border-collapse:collapse;">
                  <!-- // Begin Template Body \\ -->
                  <table border="0" cellpadding="0" cellspacing="0" width="450" id="templateBody">
                    <tr>
                      <td valign="top" class="bodyContent" style="border-collapse:collapse;background-color:#FFFFFF;">
                        <!-- // Begin Module: Standard Content \\ -->
                        <table border="0" cellpadding="12" cellspacing="0" width="100%" style="padding-bottom:10px;">
                          <tr>
                            <td valign="top" style="padding-bottom:1rem;border-collapse:collapse;" class="mainContainer">
                              <div style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                <h1 class="h1" style="color:#202020;display:block;font-family:Arial;font-size:24px;font-weight:bold;line-height:100%;margin-top:20px;margin-right:0;margin-bottom:20px;margin-left:0;text-align:center;">Verify Your Email</h1>
  
                                <!-- <h2 class="h2">Heading 2</h2>
                                                                  <h3 class="h3">Heading 3</h3>
                                                                  <h4 class="h4">Heading 4</h4> -->
                                <p>verification code : </p>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="border-collapse:collapse;">
                              <table border="0" cellpadding="0" cellspacing="0" style="padding-bottom:10px;">
                                <tbody>
                                  <tr align="center">
                                    <td align="center" valign="middle" style="border-collapse:collapse;">
                                      <p class="buttonText" href="#" target="_blank" style="color: #4A90E2;text-decoration: none;font-weight: normal;display: block;border: 2px solid #585858;padding: 10px 60px;font-family: Arial;">${val}</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!-- // End Module: Standard Content \\ -->
                      </td>
                    </tr>
                  </table>
                  <!-- // End Template Body \\ -->
                </td>
              </tr>
              <tr>
                <td align="center" valign="top" style="border-collapse:collapse;">
                  <!-- // Begin Support Section \\ -->
                  <table border="0" cellpadding="10" cellspacing="0" width="450" id="supportSection" style="background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                    <tr>
                      <td valign="top" class="supportContent" style="border-collapse:collapse;background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                        <!-- // Begin Module: Standard Footer \\ -->
                        <table border="0" cellpadding="10" cellspacing="0" width="100%">
                          <tr>
                            <td valign="top" width="100%" style="border-collapse:collapse;">
                              <br>
                              <div style="text-align: center; color: #c9c9c9;">
                                <p>Questions? Get your answers here:&nbsp;
                                pimmpim40@gmail.com .</p>
                              </div>
                              <br>
                            </td>
                          </tr>
                        </table>
                        <!-- // End Module: Standard Footer \\ -->
                      </td>
                    </tr>
                  </table>
                  <!-- // Begin Support Section \\ -->
                </td>
              </tr>
              <tr>
                <td align="center" valign="top" style="border-collapse:collapse;">
                  <!-- // Begin Template Footer \\ -->
                  <table border="0" cellpadding="10" cellspacing="0" width="450" id="templateFooter" style="background-color:#FFFFFF;border-top:0;">
                    <tr>
                      <td valign="top" class="footerContent" style="padding-left:0;border-collapse:collapse;background-color:#fafafa;">
                        <div style="text-align:center;color:#c9c9c9;font-family:Arial;font-size:11px;line-height:150%;">
                          <p style="text-align:left;margin:0;margin-top:2px;">Pandapp | Tunisie, Ariana , 3200 | Copyright © 2021 | All rights reserved</p>
                        </div>
                        <!-- // End Module: Standard Footer \\ -->
                      </td>
                    </tr>
                  </table>
                  <!-- // End Template Footer \\ -->
                </td>
              </tr>
            </table>
            <br>
          </td>
        </tr>
      </table>
    </center>
  </body>
  
  </html>
  
  `
}

module.exports = router;