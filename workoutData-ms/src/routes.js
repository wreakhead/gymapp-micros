const express = require("express");
const auth = require("./utilities/auth");
const router = express.Router();
const workoutService = require("./utilities/connection");

router.post("/createEntry", async (req, res, next) => {
  try {
    const loginData = req.body;
    const DB = await workoutService.getWorkoutData();
    const findUserData = await DB.findOne({ mobile: loginData.mobile });
    if (findUserData) {
      res.status(200).json({ message: "user exists" });
    } else {
      let createEntry = new DB({
        mobile: loginData.mobile,
        workout: [],
      });
      await createEntry.save();
      if (createEntry) res.status(200).json({ message: "entry added" });
    }
  } catch (error) {
    next(error);
  }
});
router.post("/addworkout", auth.authToken, async (req, res, next) => {
  try {
    const workoutData = req.body;

    const DB = await workoutService.getWorkoutData();
    const findUserData = await DB.findOne({ mobile: req.id.mobile });
    if (findUserData) {
      let addWorkout = await DB.updateOne(
        { mobile: req.id.mobile },
        {
          $push: {
            workout: {
              $each: [
                {
                  date: new Date(),
                  name: workoutData.name,
                  sets: workoutData.sets,
                  reps: workoutData.reps,
                  AMQRP: workoutData.AMQRP,
                  AMQRPwt: workoutData.AMQRPwt,
                  remark: workoutData.remark,
                },
              ],
              $sort: { date: 1 },
            },
          },
        }
      );
      if (addWorkout.nModified == 1) {
        res.status(200).json({ message: "workout added" });
      } else res.status(400).json({ message: "unable to update" });
    } else res.status(400).json({ message: "cannot find user" });
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteuser", auth.authToken, async (req, res, next) => {
  try {
    const DB = await workoutService.getWorkoutData();
    const deleteUser = await DB.deleteOne({ mobile: req.id.mobile });

    if (deleteUser.deletedCount == 1)
      res.status(200).json({ message: "User data deleted" });
    else res.status(400).json({ message: "error in deletion" });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
