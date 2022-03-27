require("dotenv").config();
const express = require("express");
const userdb = require("../models/ophto");
const router = express.Router();
var nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
var val;

router.post("/forgot-password", (req, res) => {
  console.log("Forgot Password")
  let val;
  try {
    let email = req.body.email;
    userdb.find({ email: email }).then((user) => {
      compte = user[0];
      if (compte) {
        val = compte._id;

        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "pimmpim40@gmail.com",
            pass: "123456789azer@@",
          },
        });
        var mailOptions = {
          from: "pimmpim40@gmail.com",
          to: compte.email,
          subject: "Reset password",
          attachments: [
            {
              filename: "insight.png",
              path: "./insight.png",
              cid: "pandaplogo.ee",
            },
          ],
          html: templateReset(val),
        };
        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        res.json("true");
      } else {
        res.json("false");
      }
    });
  } catch (error) {
    console.log(error);
  }
});


router.patch("/ophto/:email", getUserEmail, (req, res) => {
  console.log(req.params, req.body)
  console.log(res.ophto)
  // if (req.body.country != null) {
  //     res.ophto.country = req.body.country;
  // }
  if (req.body.email != null) {
      res.ophto.email = req.body.email;
  }
  if (req.body.password != null) {
      res.ophto.password = req.body.password;
  }
  if (req.body.phone_number != null) {
      res.ophto.phone_number = req.body.phone_number;
  }
  if (req.body.profilePicture != null) {
      res.ophto.profilePicture = req.body.profilePicture;
  }
  if (req.body.full_name != null) {
      res.ophto.full_name = req.body.full_name;
  }
  if (req.body.verified != null) {
      res.ophto.verified = req.body.verified;
  }
  if (req.body.social != null) {
      res.ophto.social = req.body.social;
  }
  if (req.body.role != null) {
      res.ophto.role = req.body.role;
  }
  if (req.body.description != null) {
      res.ophto.description = req.body.description;
  }

  try {
      res.ophto.save().then((updatedophto) => {
        console.loh(hello)
          res.json(updatedophto);
      });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});


router.post("/verified", (req, res) => {
  let val;
  try {
    let email = req.body.email;
    console.log("email", email);

    userdb.find({ email: email }).then((user) => {
      compte = user[0];
      if (compte) {
        console.log("the account", compte);
        if (compte) {
          let payload = {
            id: compte.id,
            email: compte.email,
          };
          console.log(payload);
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);

          val = token;
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "pimmpim40@gmail.com",
              pass: "123456789azer@@",
            },
          });
          var mailOptions = {
            from: "pimmpim40@gmail.com",
            to: compte.email,
            subject: "Verify email",
            html: templateVerify(val),
            attachments: [
              {
                filename: "insight.png",
                path: "./insight.png",
                cid: "pandaplogo.ee",
              },
            ],
          };
          transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          res.json({
            isemail: true,
          });
        } else {
          res.json({
            isemail: false,
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.patch("/verified", getUserEmail, async (req, res) => {
  if (req.body.code == val) {
    console.log(res.user);
    res.user.verified = true;
    console.log(res.user);
  }
  try {
    res.user.save().then((updateduser) => {
      res.json(updateduser);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/socauth", (req, res) => {
  try {
    let newUser = new userdb({
      nom: req.body.nom,
      email: req.body.email,
      prenom: req.body.prenom,
      image: req.body.image,
      social: true,
      verified: true,
      description: req.body.description,
    });
    userdb.find({ email: newUser.email }).then((sss) => {
      ss = sss[0];
      console.log(ss);
      if (ss) {
        let payload = {
          id: ss.id,
          role: ss.role,
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
              role: compte.role,
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

router.get("/", (req, res) => {
  res.json({ test: "test" });
});

router.post("/sign-in", (req, res) => {
  try {
    console.log(req.body);
    let email = req.body.email;
    let password = req.body.password;
    console.log(email, password);
    userdb.find({ email: email, password: password }).then((user) => {
      let compte = user[0];
      if (compte) {
        let payload = {
          id: compte.id,
          email: compte.email,
        };
        console.log(payload);
        const token = jwt.sign(payload, process.env.TOKEN_SECRET);

        res.json({ accessToken: token, user: compte });
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

router.post("/refresh-access-token", (req, res) => {
  try {
    console.log("hellew", parseJwt(req.body.accessToken));
    userdb.find({ _id: parseJwt(req.body.accessToken).id }).then((user) => {
      let compte = user[0];
      if (compte) {
        console.log("Compte", compte);
        let payload = {
          id: compte.id,
          email: compte.email,
        };
        console.log(payload);
        const token = jwt.sign(payload, process.env.TOKEN_SECRET);
        res.json({ accessToken: token, user: compte });
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
    let email = req.body.email;

    console.log(email);
    userdb.find({ email: email }).then((user) => {
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

router.get("/current/:id", (req, res) => {
  try {
    console.log("hello", req.query.id);
    userdb
      .find({ _id: req.body.query.id })
      .then((user) => {
        console.log("hello", user[0]);
        if (user) {
          res.json(user);
        } else {
          res.status(401);
          res.json({
            error: "UNAUTHORIZED",
          });
        }
      })
      .catch((err) => {
        res.status(401);
        res.json({
          error: "UNAUTHORIZED",
        });
      });
  } catch (err) {
    res.json({
      error: err,
    });
  }
});
router.post("/reset-password", getUserById, async (req, res) => {
  console.log(req.body)

  if (req.body.password != null) {
    res.user.password = req.body.password;
  }

  try {
    res.user.save().then((updateduser) => {
      res.json(updateduser);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
async function getUserById(req, res, next) {
  console.log(req.body)
  try {
    user = await userdb.find({ _id: req.body.id });
    if (user == null) {
      return res.status(404).json({ message: "cannot find user" });
    }
  } catch (error) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user[0];
  next();
}
async function getUserEmail(req, res, next) {
  try {
    user = await userdb.find({ email: req.body.email });
    if (user == null) {
      return res.status(404).json({ message: "cannot find user" });
    }
  } catch (error) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user[0];
  next();
}
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
function templateReset(val) {
  return (
    `
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
    @tip Set the background color for your email. You may want to choose one that matches your company's branding.
    @theme page
    */
      body,#backgroundTable{
        /*@editable*/background-color:#FAFAFA;
      }
    /*
    @tab Page
    @section email border
    @tip Set the border for your email.
    */
      #templateContainer{
        /*@editable*/border:1px none #DDDDDD;
      }
    /*
    @tab Page
    @section heading 1
    @tip Set the styling for all first-level headings in your emails. These should be the largest of your headings.
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
    @tip Set the styling for all second-level headings in your emails.
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
    @tip Set the styling for all third-level headings in your emails.
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
    @tip Set the styling for all fourth-level headings in your emails. These should be the smallest of your headings.
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
    @tip Set the background color for your email's preheader area.
    @theme page
    */
      #templatePreheader{
        /*@editable*/background-color:#FAFAFA;
      }
    /*
    @tab Header
    @section preheader text
    @tip Set the styling for your email's preheader text. Choose a size and color that is easy to read.
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
    @tip Set the styling for your email's preheader links. Choose a color that helps them stand out from your text.
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
    @tip Set the background color and border for your email's header area.
    @theme header
    */
      #templateHeader{
        /*@editable*/background-color:#FFFFFF;
        /*@editable*/border-bottom:0;
      }
    /*
    @tab Header
    @section header text
    @tip Set the styling for your email's header text. Choose a size and color that is easy to read.
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
    @tip Set the styling for your email's header links. Choose a color that helps them stand out from your text.
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
    @tip Set the background color for your email's body area.
    */
      #templateContainer,.bodyContent{
        /*@editable*/background-color:#FFFFFF;
      }
    /*
    @tab Body
    @section body text
    @tip Set the styling for your email's main content text. Choose a size and color that is easy to read.
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
    @tip Set the styling for your email's main content links. Choose a color that helps them stand out from your text.
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
    @tip Set the background color and top border for your email's footer area.
    @theme footer
    */
      #templateFooter{
        /*@editable*/background-color:#FFFFFF;
        /*@editable*/border-top:0;
      }
    /*
    @tab Footer
    @section footer text
    @tip Set the styling for your email's footer text. Choose a size and color that is easy to read.
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
    @tip Set the styling for your email's footer links. Choose a color that helps them stand out from your text.
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
    @tip Set the background color and border for your email's footer social bar.
    @theme footer
    */
      #social{
        /*@editable*/background-color:#FAFAFA;
        /*@editable*/border:0;
      }
    /*
    @tab Footer
    @section social bar style
    @tip Set the background color and border for your email's footer social bar.
    */
      #social div{
        /*@editable*/text-align:left;
      }
    /*
    @tab Footer
    @section utility bar style
    @tip Set the background color and border for your email's footer utility bar.
    @theme footer
    */
      #utility{
        /*@editable*/background-color:#FFFFFF;
        /*@editable*/border:0;
      }
    /*
    @tab Footer
    @section utility bar style
    @tip Set the background color and border for your email's footer utility bar.
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
                                                     Use this area to offer a short teaser of your email's content. Text here will show in the preview area of some email clients.
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
                                    <p class="buttonText" href="#" target="_blank" style="color: #4A90E2;text-decoration: none;font-weight: normal;display: block;border: 2px solid #585858;padding: 10px 60px;font-family: Arial;">  <a href='http://localhost:4200/reset-password/` +
    val +
    `' >
                                                                    click here !
                                                                    </a></p>
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
  );
}

function templateVerify(val) {
  return (
    `
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
    @tip Set the background color for your email. You may want to choose one that matches your company's branding.
    @theme page
    */
      body,#backgroundTable{
        /*@editable*/background-color:#FAFAFA;
      }
    /*
    @tab Page
    @section email border
    @tip Set the border for your email.
    */
      #templateContainer{
        /*@editable*/border:1px none #DDDDDD;
      }
    /*
    @tab Page
    @section heading 1
    @tip Set the styling for all first-level headings in your emails. These should be the largest of your headings.
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
    @tip Set the styling for all second-level headings in your emails.
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
    @tip Set the styling for all third-level headings in your emails.
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
    @tip Set the styling for all fourth-level headings in your emails. These should be the smallest of your headings.
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
    @tip Set the background color for your email's preheader area.
    @theme page
    */
      #templatePreheader{
        /*@editable*/background-color:#FAFAFA;
      }
    /*
    @tab Header
    @section preheader text
    @tip Set the styling for your email's preheader text. Choose a size and color that is easy to read.
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
    @tip Set the styling for your email's preheader links. Choose a color that helps them stand out from your text.
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
    @tip Set the background color and border for your email's header area.
    @theme header
    */
      #templateHeader{
        /*@editable*/background-color:#FFFFFF;
        /*@editable*/border-bottom:0;
      }
    /*
    @tab Header
    @section header text
    @tip Set the styling for your email's header text. Choose a size and color that is easy to read.
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
    @tip Set the styling for your email's header links. Choose a color that helps them stand out from your text.
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
    @tip Set the background color for your email's body area.
    */
      #templateContainer,.bodyContent{
        /*@editable*/background-color:#FFFFFF;
      }
    /*
    @tab Body
    @section body text
    @tip Set the styling for your email's main content text. Choose a size and color that is easy to read.
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
    @tip Set the styling for your email's main content links. Choose a color that helps them stand out from your text.
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
    @tip Set the background color and top border for your email's footer area.
    @theme footer
    */
      #templateFooter{
        /*@editable*/background-color:#FFFFFF;
        /*@editable*/border-top:0;
      }
    /*
    @tab Footer
    @section footer text
    @tip Set the styling for your email's footer text. Choose a size and color that is easy to read.
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
    @tip Set the styling for your email's footer links. Choose a color that helps them stand out from your text.
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
    @tip Set the background color and border for your email's footer social bar.
    @theme footer
    */
      #social{
        /*@editable*/background-color:#FAFAFA;
        /*@editable*/border:0;
      }
    /*
    @tab Footer
    @section social bar style
    @tip Set the background color and border for your email's footer social bar.
    */
      #social div{
        /*@editable*/text-align:left;
      }
    /*
    @tab Footer
    @section utility bar style
    @tip Set the background color and border for your email's footer utility bar.
    @theme footer
    */
      #utility{
        /*@editable*/background-color:#FFFFFF;
        /*@editable*/border:0;
      }
    /*
    @tab Footer
    @section utility bar style
    @tip Set the background color and border for your email's footer utility bar.
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
                                                     Use this area to offer a short teaser of your email's content. Text here will show in the preview area of some email clients.
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
                              <p>verification Button : </p>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="border-collapse:collapse;">
                            <table border="0" cellpadding="0" cellspacing="0" style="padding-bottom:10px;">
                              <tbody>
                                <tr align="center">
                                  <td align="center" valign="middle" style="border-collapse:collapse;">
                                    <p class="buttonText" href="#" target="_blank" style="color: #4A90E2;text-decoration: none;font-weight: normal;display: block;border: 2px solid #585858;padding: 10px 60px;font-family: Arial;">
                                    <a href='http://localhost:4200/confirmed/` +
    val +
    `' >
                                    click here !
                                    </a>
                                    
                                    
                                    </p>
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
  );
}

module.exports = router;
