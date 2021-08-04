const jwt = require("jsonwebtoken");
require("dotenv").config();

const TOKEN_KEY = process.env.TOKEN_KEY;

let auth = {};

auth.authToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  else {
    jwt.verify(token, TOKEN_KEY, (err, id) => {
      if (err) return res.sendStatus(403);
      else {
        req.id = id;
        next();
      }
    });
  }
};
module.exports = auth;
