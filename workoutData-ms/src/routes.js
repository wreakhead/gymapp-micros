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
                  type: workoutData.type,
                  sets: workoutData.sets,
                  reps: workoutData.reps,
                  weight: workoutData.weight,
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

router.get("/getworkoutdata", auth.authToken, async (req, res, next) => {
  try {
    const DB = await workoutService.getWorkoutData();
    const getData = await DB.findOne({ mobile: req.id.mobile }, { workout: 1 });
    if (getData) {
      res.status(200).json(getData);
    } else res.status(200).json({ message: "no data" });
  } catch (error) {
    next(error);
  }
});

router.get("/workoutsuggestion", auth.authToken, async (req, res, next) => {
  try {
    const DB = await workoutService.getWorkoutData();
    const getData = await DB.find(
      { mobile: req.id.mobile },
      { "workout": 1 }
    );
    if (getData) {
      let names = [];
      let dates =[];
      getData[0].workout.map((ele) => {
        names.push(ele.name);
        dates.push(ele.date.getFullYear())
      });
      names = [...new Set(names)];
      dates = [...new Set(dates)]

      res.status(200).json({names:names,dates:dates});
    } else res.status(200).json({ message: "no data" });
  } catch (error) {
    next(error);
  }
});

router.get("/getgraphdata", auth.authToken, async (req, res, next) => {
  try {
    const DB = await workoutService.getWorkoutData();
    const getData = await DB.find({ mobile: req.id.mobile }, { workout: 1 });
    if (getData) {
      //getting unique dates
      let dates = [];
      getData[0].workout.map((ele) => {
        dates.push(ele.date.toISOString().substring(0, 10));
      });
      dates = [...new Set(dates)];

      //categorising workout w.r.t push,pull,leg.
      const pushData = [];
      const pullData = [];
      const legData = [];

      dates.map((date)=>{
        let totalPushWt=0
        let totalPullWt=0
        let totalLegWt=0

        getData[0].workout.map((el) => {
          if (el.type == "push" && (date == el.date.toISOString().substring(0, 10))) {
            totalPushWt = totalPushWt+el.weight;
          }
          if (el.type == "pull" && (date == el.date.toISOString().substring(0, 10))) {
            totalPullWt = totalPullWt+el.weight;
          }
          if (el.type == "leg"&& (date == el.date.toISOString().substring(0, 10))) {
            totalLegWt = totalLegWt+el.weight;
          }
        });
        if(totalPushWt!=0) pushData.push({date:date,weight:totalPushWt})
        if(totalPullWt!=0) pullData.push({date:date,weight:totalPullWt})
        if(totalLegWt!=0) legData.push({date:date,weight:totalLegWt}) 

      })
      
      

      res.status(200).json({pushData,pullData,legData});
    } else res.status(200).json({ message: "no data" });
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteworkout/:_id", auth.authToken, async (req, res, next) => {
  try {
    const DB = await workoutService.getWorkoutData();
    const delData = await DB.updateOne(
      { mobile: req.id.mobile },
      { $pull: { workout: { _id: req.params._id } } }
    );
    if (delData.nModified == 1) res.status(200).json({ status: "done" });
    else res.status(404).json({ status: "not found" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
