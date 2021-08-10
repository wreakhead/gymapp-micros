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

      let calories = 0;
      let carbs = 0;
      let fat = 0;
      let protein = 0;
      let fiber = 0;

      if (filterOne[0]?.measure == "per 100gm") {
        calories = Math.round(
          (filterOne[0]?.calories / 100) * breakfastData.amount
        );
        carbs = Math.round((filterOne[0]?.carbs / 100) * breakfastData.amount);
        fat = Math.round((filterOne[0]?.fat / 100) * breakfastData.amount);
        protein = Math.round(
          (filterOne[0]?.protein / 100) * breakfastData.amount
        );
        fiber = Math.round((filterOne[0]?.fiber / 100) * breakfastData.amount);
      } else {
        calories = Math.round(filterOne[0]?.calories * breakfastData.amount);
        carbs = Math.round(filterOne[0]?.carbs * breakfastData.amount);
        fat = Math.round(filterOne[0]?.fat * breakfastData.amount);
        protein = Math.round(filterOne[0]?.protein * breakfastData.amount);
        fiber = Math.round(filterOne[0]?.fiber * breakfastData.amount);
      }

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
                  fiber: fiber,
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
      let calories = 0;
      let carbs = 0;
      let fat = 0;
      let protein = 0;
      let fiber = 0;

      if (filterOne[0]?.measure == "per 100gm") {
        calories = Math.round(
          (filterOne[0]?.calories / 100) * lunchData.amount
        );
        carbs = Math.round((filterOne[0]?.carbs / 100) * lunchData.amount);
        fat = Math.round((filterOne[0]?.fat / 100) * lunchData.amount);
        protein = Math.round((filterOne[0]?.protein / 100) * lunchData.amount);
        fiber = Math.round((filterOne[0]?.fiber / 100) * lunchData.amount);
      } else {
        calories = Math.round(filterOne[0]?.calories * lunchData.amount);
        carbs = Math.round(filterOne[0]?.carbs * lunchData.amount);
        fat = Math.round(filterOne[0]?.fat * lunchData.amount);
        protein = Math.round(filterOne[0]?.protein * lunchData.amount);
        fiber = Math.round(filterOne[0]?.fiber * lunchData.amount);
      }

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
      if (filterOne[0]?.measure == "per 100gm") {
        calories = Math.round(
          (filterOne[0]?.calories / 100) * snacksData.amount
        );
        carbs = Math.round((filterOne[0]?.carbs / 100) * snacksData.amount);
        fat = Math.round((filterOne[0]?.fat / 100) * snacksData.amount);
        protein = Math.round((filterOne[0]?.protein / 100) * snacksData.amount);
        fiber = Math.round((filterOne[0]?.fiber / 100) * snacksData.amount);
      } else {
        calories = Math.round(filterOne[0]?.calories * snacksData.amount);
        carbs = Math.round(filterOne[0]?.carbs * snacksData.amount);
        fat = Math.round(filterOne[0]?.fat * snacksData.amount);
        protein = Math.round(filterOne[0]?.protein * snacksData.amount);
        fiber = Math.round(filterOne[0]?.fiber * snacksData.amount);
      }

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
      if (filterOne[0]?.measure == "per 100gm") {
        calories = Math.round(
          (filterOne[0]?.calories / 100) * dinnerData.amount
        );
        carbs = Math.round((filterOne[0]?.carbs / 100) * dinnerData.amount);
        fat = Math.round((filterOne[0]?.fat / 100) * dinnerData.amount);
        protein = Math.round((filterOne[0]?.protein / 100) * dinnerData.amount);
        fiber = Math.round((filterOne[0]?.fiber / 100) * dinnerData.amount);
      } else {
        calories = Math.round(filterOne[0]?.calories * dinnerData.amount);
        carbs = Math.round(filterOne[0]?.carbs * dinnerData.amount);
        fat = Math.round(filterOne[0]?.fat * dinnerData.amount);
        protein = Math.round(filterOne[0]?.protein * dinnerData.amount);
        fiber = Math.round(filterOne[0]?.fiber * dinnerData.amount);
      }

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

router.get("/getbreakfastlog", auth.authToken, async (req, res, next) => {
  try {
    const DB = await dietService.getDietData();
    const findUser = await DB.findOne(
      { mobile: req.id.mobile },
      { breakfast: 1 }
    );
    if (findUser) {
      todayDate = new Date();

      const todaysLog = findUser.breakfast.filter((ele) => {
        if (ele.date.toLocaleDateString() == todayDate.toLocaleDateString())
          return ele;
      });
      res.status(200).json({ todaysLog });
    } else res.status(400).json({ message: "cannot find user" });
  } catch (error) {
    next(error);
  }
});
router.get("/getlunchlog", auth.authToken, async (req, res, next) => {
  try {
    const DB = await dietService.getDietData();
    const findUser = await DB.findOne({ mobile: req.id.mobile }, { lunch: 1 });
    if (findUser) {
      todayDate = new Date();

      const todaysLog = findUser.lunch.filter((ele) => {
        if (ele.date.toLocaleDateString() == todayDate.toLocaleDateString())
          return ele;
      });
      res.status(200).json({ todaysLog });
    } else res.status(400).json({ message: "cannot find user" });
  } catch (error) {
    next(error);
  }
});
router.get("/getsnackslog", auth.authToken, async (req, res, next) => {
  try {
    const DB = await dietService.getDietData();
    const findUser = await DB.findOne({ mobile: req.id.mobile }, { snacks: 1 });
    if (findUser) {
      todayDate = new Date();

      const todaysLog = findUser.snacks.filter((ele) => {
        if (ele.date.toLocaleDateString() == todayDate.toLocaleDateString())
          return ele;
      });
      res.status(200).json({ todaysLog });
    } else res.status(400).json({ message: "cannot find user" });
  } catch (error) {
    next(error);
  }
});
router.get("/getdinnerlog", auth.authToken, async (req, res, next) => {
  try {
    const DB = await dietService.getDietData();
    const findUser = await DB.findOne({ mobile: req.id.mobile }, { dinner: 1 });
    if (findUser) {
      todayDate = new Date();

      const todaysLog = findUser.dinner.filter((ele) => {
        if (ele.date.toLocaleDateString() == todayDate.toLocaleDateString())
          return ele;
      });
      res.status(200).json({ todaysLog });
    } else res.status(400).json({ message: "cannot find user" });
  } catch (error) {
    next(error);
  }
});
router.get("/intakeMacros", auth.authToken, async (req, res, next) => {
  try {
    const DB = await dietService.getDietData();
    const findUser = await DB.findOne({ mobile: req.id.mobile });
    if (findUser) {
      todayDate = new Date();
      let totalCalories = 0;
      let totalFat = 0;
      let totalFiber = 0;
      let totalCarbs = 0;
      let totalProtein = 0;
      findUser.breakfast.map((ele) => {
        if (ele.date.toLocaleDateString() == todayDate.toLocaleDateString()) {
          totalCalories = ele.calories + totalCalories;
          totalFat = ele.fat + totalFat;
          totalFiber = ele.fiber + totalFiber;
          totalCarbs = ele.carbs + totalCarbs;
          totalProtein = ele.protein + totalProtein;
        }
      });
      findUser.lunch.map((ele) => {
        if (ele.date.toLocaleDateString() == todayDate.toLocaleDateString()) {
          totalCalories = ele.calories + totalCalories;
          totalFat = ele.fat + totalFat;
          totalFiber = ele.fiber + totalFiber;
          totalCarbs = ele.carbs + totalCarbs;
          totalProtein = ele.protein + totalProtein;
        }
      });
      findUser.snacks.map((ele) => {
        if (ele.date.toLocaleDateString() == todayDate.toLocaleDateString()) {
          totalCalories = ele.calories + totalCalories;
          totalFat = ele.fat + totalFat;
          totalFiber = ele.fiber + totalFiber;
          totalCarbs = ele.carbs + totalCarbs;
          totalProtein = ele.protein + totalProtein;
        }
      });
      findUser.dinner.map((ele) => {
        if (ele.date.toLocaleDateString() == todayDate.toLocaleDateString()) {
          totalCalories = ele.calories + totalCalories;
          totalFat = ele.fat + totalFat;
          totalFiber = ele.fiber + totalFiber;
          totalCarbs = ele.carbs + totalCarbs;
          totalProtein = ele.protein + totalProtein;
        }
      });
      res.status(200).json({
        totalCalories,
        totalFat,
        totalCarbs,
        totalFiber,
        totalProtein,
      });
    } else res.status(400).json({ message: "cannot find user" });
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/deletebreakfast/:_id",
  auth.authToken,
  async (req, res, next) => {
    try {
      const DB = await dietService.getDietData();

      const delData = await DB.updateOne(
        { mobile: req.id.mobile },
        { $pull: { breakfast: { _id: req.params._id } } }
      );
      if (delData.nModified == 1) res.status(200).json({ status: "done" });
      else res.status(404).json({ status: "not found" });
    } catch (error) {
      next(error);
    }
  }
);
router.delete("/deletelunch/:_id", auth.authToken, async (req, res, next) => {
  try {
    const DB = await dietService.getDietData();

    const delData = await DB.updateOne(
      { mobile: req.id.mobile },
      { $pull: { lunch: { _id: req.params._id } } }
    );
    if (delData.nModified == 1) res.status(200).json({ status: "done" });
    else res.status(404).json({ status: "not found" });
  } catch (error) {
    next(error);
  }
});
router.delete("/deletesnacks/:_id", auth.authToken, async (req, res, next) => {
  try {
    const DB = await dietService.getDietData();

    const delData = await DB.updateOne(
      { mobile: req.id.mobile },
      { $pull: { snacks: { _id: req.params._id } } }
    );
    if (delData.nModified == 1) res.status(200).json({ status: "done" });
    else res.status(404).json({ status: "not found" });
  } catch (error) {
    next(error);
  }
});
router.delete("/deletedinner/:_id", auth.authToken, async (req, res, next) => {
  try {
    const DB = await dietService.getDietData();

    const delData = await DB.updateOne(
      { mobile: req.id.mobile },
      { $pull: { dinner: { _id: req.params._id } } }
    );
    if (delData.nModified == 1) res.status(200).json({ status: "done" });
    else res.status(404).json({ status: "not found" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
