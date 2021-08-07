const express = require("express");
const auth = require("./utilities/auth");
const router = express.Router();
const dietService = require("./utilities/connection");
const axios = require("axios");
const foodapi = "http://localhost:7003/";

router.post("/createEntry", async (req, res, next) => {
  try {
    const loginData = req.body;
    const DB = await dietService.getDietData();
    const findUserData = await DB.findOne({ mobile: loginData.mobile });
    if (findUserData) {
      res.status(200).json({ message: "user exists" });
    } else {
      let createEntry = new DB({
        mobile: loginData.mobile,
        target: [],
        breakfast: [],
        lunch: [],
        snacks: [],
        dinner: [],
      });
      await createEntry.save();
      if (createEntry) res.status(200).json({ message: "entry added" });
    }
  } catch (error) {
    next(error);
  }
});
router.post("/addbreakfast", auth.authToken, async (req, res, next) => {
  try {
    const breakfastData = req.body;

    const DB = await dietService.getDietData();
    const findUserData = await DB.findOne({ mobile: req.id.mobile });

    if (findUserData) {
      const getFoodData = await axios.get(`${foodapi}getfood`);

      const filterOne = getFoodData?.data.allData.filter((data) => {
        if (data.name == breakfastData.name) {
          return data;
        }
      });
      const calories = Math.round(
        (filterOne[0]?.calories / 100) * breakfastData.amount
      );
      const carbs = Math.round(
        (filterOne[0]?.carbs / 100) * breakfastData.amount
      );
      const fat = Math.round((filterOne[0]?.fat / 100) * breakfastData.amount);
      const protein = Math.round(
        (filterOne[0]?.fat / 100) * breakfastData.amount
      );

      console.log(filterOne);
      let addBreakfast = await DB.updateOne(
        { mobile: req.id.mobile },
        {
          $push: {
            breakfast: {
              $each: [
                {
                  date: new Date(),
                  name: breakfastData.name,
                  calories: calories,
                  carbs: carbs,
                  fat: fat,
                  protein: protein,
                },
              ],
              $sort: { date: -1 },
            },
          },
        }
      );
      if (addBreakfast.nModified == 1) {
        res.status(200).json({ message: "food added" });
      } else res.status(400).json({ message: "unable to update" });
    } else res.status(400).json({ message: "cannot find user" });
  } catch (error) {
    next(error);
  }
});
router.post("/addlunch", auth.authToken, async (req, res, next) => {
  try {
    const lunchData = req.body;

    const DB = await dietService.getDietData();
    const findUserData = await DB.findOne({ mobile: req.id.mobile });

    if (findUserData) {
      const getFoodData = await axios.get(`${foodapi}getfood`);

      const filterOne = getFoodData?.data.allData.filter((data) => {
        if (data.name == lunchData.name) {
          return data;
        }
      });
      const calories = Math.round(
        (filterOne[0]?.calories / 100) * lunchData.amount
      );
      const carbs = Math.round((filterOne[0]?.carbs / 100) * lunchData.amount);
      const fat = Math.round((filterOne[0]?.fat / 100) * lunchData.amount);
      const protein = Math.round((filterOne[0]?.fat / 100) * lunchData.amount);
      const fiber = Math.round((filterOne[0]?.fiber / 100) * lunchData.amount);

      console.log(filterOne);
      let addlunch = await DB.updateOne(
        { mobile: req.id.mobile },
        {
          $push: {
            lunch: {
              $each: [
                {
                  date: new Date(),
                  name: lunchData.name,
                  calories: calories,
                  carbs: carbs,
                  fat: fat,
                  protein: protein,
                  fiber: fiber,
                },
              ],
              $sort: { date: -1 },
            },
          },
        }
      );
      if (addlunch.nModified == 1) {
        res.status(200).json({ message: "food added" });
      } else res.status(400).json({ message: "unable to update" });
    } else res.status(400).json({ message: "cannot find user" });
  } catch (error) {
    next(error);
  }
});
router.post("/addsnacks", auth.authToken, async (req, res, next) => {
  try {
    const snacksData = req.body;

    const DB = await dietService.getDietData();
    const findUserData = await DB.findOne({ mobile: req.id.mobile });

    if (findUserData) {
      const getFoodData = await axios.get(`${foodapi}getfood`);

      const filterOne = getFoodData?.data.allData.filter((data) => {
        if (data.name == snacksData.name) {
          return data;
        }
      });
      const calories = Math.round(
        (filterOne[0]?.calories / 100) * snacksData.amount
      );
      const carbs = Math.round((filterOne[0]?.carbs / 100) * snacksData.amount);
      const fat = Math.round((filterOne[0]?.fat / 100) * snacksData.amount);
      const protein = Math.round((filterOne[0]?.fat / 100) * snacksData.amount);
      const fiber = Math.round((filterOne[0]?.fiber / 100) * snacksData.amount);

      console.log(filterOne);
      let addsnacks = await DB.updateOne(
        { mobile: req.id.mobile },
        {
          $push: {
            snacks: {
              $each: [
                {
                  date: new Date(),
                  name: snacksData.name,
                  calories: calories,
                  carbs: carbs,
                  fat: fat,
                  protein: protein,
                  fiber: fiber,
                },
              ],
              $sort: { date: -1 },
            },
          },
        }
      );
      if (addsnacks.nModified == 1) {
        res.status(200).json({ message: "food added" });
      } else res.status(400).json({ message: "unable to update" });
    } else res.status(400).json({ message: "cannot find user" });
  } catch (error) {
    next(error);
  }
});
router.post("/adddinner", auth.authToken, async (req, res, next) => {
  try {
    const dinnerData = req.body;

    const DB = await dietService.getDietData();
    const findUserData = await DB.findOne({ mobile: req.id.mobile });

    if (findUserData) {
      const getFoodData = await axios.get(`${foodapi}getfood`);

      const filterOne = getFoodData?.data.allData.filter((data) => {
        if (data.name == dinnerData.name) {
          return data;
        }
      });
      const calories = Math.round(
        (filterOne[0]?.calories / 100) * dinnerData.amount
      );
      const carbs = Math.round((filterOne[0]?.carbs / 100) * dinnerData.amount);
      const fat = Math.round((filterOne[0]?.fat / 100) * dinnerData.amount);
      const protein = Math.round((filterOne[0]?.fat / 100) * dinnerData.amount);
      const fiber = Math.round((filterOne[0]?.fiber / 100) * dinnerData.amount);

      console.log(filterOne);
      let addinner = await DB.updateOne(
        { mobile: req.id.mobile },
        {
          $push: {
            dinner: {
              $each: [
                {
                  date: new Date(),
                  name: dinnerData.name,
                  calories: calories,
                  carbs: carbs,
                  fat: fat,
                  protein: protein,
                  fiber: fiber,
                },
              ],
              $sort: { date: -1 },
            },
          },
        }
      );
      if (addinner.nModified == 1) {
        res.status(200).json({ message: "food added" });
      } else res.status(400).json({ message: "unable to update" });
    } else res.status(400).json({ message: "cannot find user" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
