const express = require("express");
const { eventNames } = require(".");
const router = express.Router();
const foodService = require("./utilities/connection");

router.get("/getfood", async (req, res, next) => {
  try {
    const DB = await foodService.getFoodData();
    const allData = await DB.find();
    if (allData) {
      res.status(200).json({ allData });
    } else {
      res.json(200).json({ message: "no data" });
    }
  } catch (error) {
    next(error);
  }
});
router.post("/updatefood", async (req, res, next) => {
  try {
    const food = req.body;

    const DB = await foodService.getFoodData();
    const getData = await DB.find();
    let date = new Date();
    if (getData) {
      const checkDuplicate = await DB.findOne({ name: food.name });
      if (checkDuplicate) {
        res.status(200).json({ messsage: "Food exists" });
      } else {
        const updateData = new DB({
          date: date,
          category: food.category,
          measure: food.measure,
          name: food.name,
          calories: food.calories,
          carbs: food.carbs,
          fat: food.fat,
          fiber: food.fiber,
          protein: food.protein,
        });
        await updateData.save();
        if (updateData) {
          res.status(200).json({ messsage: "Food Added" });
        } else {
          res.status(500).json({ message: "Food not added" });
        }
      }
    } else res.json(200).json({ message: "Can't update" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
