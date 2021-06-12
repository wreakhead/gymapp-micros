const mongoose = require("mongoose");
const { Schema } = require("mongoose");

mongoose.Schema.promise = global.Promise;

mongoose.set("useCreateIndex", true);
const url = "";
const workoutData = Schema(
  {
    mobile: { type: String },
    workout: [
      {
        date: { type: Date, default: new Date() },
        name: { type: String },
        sets: { type: Number },
        reps: { type: Number },
        weight: { type: Number },
        AMQRP: { type: Number },
        AMQRPwt: { type: Number },
        remark: { type: String },
      },
    ],
  },
  { collection: "workoutData" }
);

let collection = {};

collection.getWorkoutData = async () => {
  try {
    let database = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let model = await database.model("workoutData", workoutData);

    return model;
  } catch {
    let err = new Error("connection failed");
    error.status = 500;
    throw error;
  }
};

module.exports = collection;
