const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
const validators = require("./utilities/validators");
const loginService = require("./utilities/connection");
const workoutUrl = "http://localhost:7001/";
const axios = require("axios");
require("dotenv").config();
const Token = process.env.TOKEN_KEY;

const auth = require("./utilities/auth");
router.post("/signup", async (req, res, next) => {
  try {
    const loginData = req.body;
    const DB = await loginService.getLoginCreds();
    const findUser = await DB.findOne({ mobile: loginData.mobile });
    if (findUser) {
      res.status(400).json({ message: "user already exists!" });
    } else {
      let createEntry = await axios.post(`${workoutUrl}createEntry`, loginData);
      console.log(createEntry.data.message);
      if (
        validators.nameCheck(loginData.name) &&
        validators.mobileCheck(loginData.mobile) &&
        validators.passwordCheck(loginData.password) &&
        createEntry.data.message == "entry added"
      ) {
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(loginData.password, salt);

        const updateData = new DB({
          date: new Date(),
          name: loginData.name,
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
        const newToken = await jwt.sign({ mobile: findUser.mobile }, Token);

        res
          .status(200)
          .json({
            id: findUser._id,
            name: findUser.name,
            date: findUser.date,
            token: newToken,
          });
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

router.delete("/deleteuser", auth.authToken, async (req, res, next) => {
  try {
    let DB = await loginService.getLoginCreds();
    let deleteUser = await DB.deleteOne({ mobile: req.id.mobile });

    const config = {
      headers: { authorization: `Bearer ${req.token}` },
    };

    let deleteUserData = await axios.delete(`${workoutUrl}deleteuser`, config);

    if (deleteUser.deletedCount == 1 && deleteUserData.deletedCount == 1)
      res.status(200).json({ message: "User deleted" });
    else res.status(400).json({ message: "error in deletion" });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
