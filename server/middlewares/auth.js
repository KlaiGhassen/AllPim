const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  try {
    
    req.body["payload"] = await jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("payload",req.body.payload);
    next();
  } catch (error) {
    res.sendStatus(403);
  }
};

module.exports = authMiddleware;
