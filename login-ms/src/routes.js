const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
const validators = require("./utilities/validators");
const loginService = require("./utilities/connection");

router.post("/signup", async (req, res, next) => {
  try {
    const loginData = req.body;

    const DB = await loginService.getLoginCreds();
    const findUser = await DB.findOne({ mobile: loginData.mobile });
    if (findUser) {
      res.status(400).json({ message: "user already exists!" });
    } else {
      if (
        validators.mobileCheck(loginData.mobile) &&
        validators.passwordCheck(loginData.password)
      ) {
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(loginData.password, salt);

        const updateData = new DB({
          mobile: loginData.mobile,
          password: hashedPass,
        });
        await updateData.save();

        if (updateData) {
          res.status(200).json({ messsage: "User Added" });
        } else {
          res.status(500).json({ message: "User not added" });
        }
      } else res.status(500).json({ message: "validation failed" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/signin", async (req, res, next) => {
  try {
    
    let loginData = req.body;
    let DB = await loginService.getLoginCreds();
    let findUser = await DB.findOne({ mobile: loginData.mobile });

    if (findUser) {
      if (await bcrypt.compare(loginData.password, findUser.password)) {
        const newToken = await jwt.sign(
          { _id: findUser._id },
          "jksdu6787sab373768734khbxc76736jsh65364dc65237er24",
          { expiresIn: 120 }
        );

        res.status(200).json({ message: "logged in", token: newToken });
      } else {
        res.status(400).json({ message: "password incorrect" });
      }
    } else {
      res.status(404).json({ message: "user do not exist" });
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
