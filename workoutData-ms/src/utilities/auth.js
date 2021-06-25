const jwt = require("jsonwebtoken");
let auth = {};
auth.authToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  else {
    jwt.verify(
      token,
      "jksdu6787sab373768734khbxc76736jsh65364dc65237er24",
      (err, id) => {
        if (err) return res.sendStatus(403);
        else {
          req.id = id;
          
          next();
        }
        
      }
    );
  }
};
module.exports = auth;
