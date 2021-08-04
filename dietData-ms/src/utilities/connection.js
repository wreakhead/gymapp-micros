const mongoose = require("mongoose");
const { Schema } = require("mongoose");
mongoose.Schema.promise = global.promise;
mongoose.set("useCreateIndex", true);

require("dotenv").config();
const url = process.env.KEY;

const dietData = Schema(
  {
    mobile: { type: String },
    breakfast: [
      {
        date: { type: Date, default: new Date() },
        name: { type: String },
        calories: { type: Number },
        carbs: { type: Number },
        fat: { type: Number },
      },
    ],
    lunch: [
      {
        date: { type: Date, default: new Date() },
        name: { type: String },
        calories: { type: Number },
        carbs: { type: Number },
        fat: { type: Number },
      },
    ],
    snacks: [
      {
        date: { type: Date, default: new Date() },
        name: { type: String },
        calories: { type: Number },
        carbs: { type: Number },
        fat: { type: Number },
      },
    ],
    dinner: [
      {
        date: { type: Date, default: new Date() },
        name: { type: String },
        calories: { type: Number },
        carbs: { type: Number },
        fat: { type: Number },
      },
    ],
  },
  { collection: "dietData" }
);

let collection = {};

collection.getDietData = async () => {
  try {
    let database = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let model = await database.model("dietData", dietData);
    return model;
  } catch {
    let err = new Error("connection failed");
    error.status = 500;
    throw error;
  }
};
module.exports = collection;
