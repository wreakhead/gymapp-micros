const mongoose = require("mongoose");
const { Schema } = require("mongoose");
mongoose.Schema.promise = global.promise;
mongoose.set("useCreateIndex", true);

require("dotenv").config();
const url = process.env.KEY;

const dietData = Schema(
  {
    mobile: { type: String },
    target: [
      {
        date: { type: Date, default: new Date() },
        calories: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
      },
    ],
    breakfast: [
      {
        date: { type: Date, default: new Date() },
        name: { type: String },
        calories: { type: Number },
        carbs: { type: Number },
        fat: { type: Number },
        protein: { type: Number },
        fiber: { type: Number },
      },
    ],
    lunch: [
      {
        date: { type: Date, default: new Date() },
        name: { type: String },
        calories: { type: Number },
        carbs: { type: Number },
        fat: { type: Number },
        protein: { type: Number },
        fiber: { type: Number },
      },
    ],
    snacks: [
      {
        date: { type: Date, default: new Date() },
        name: { type: String },
        calories: { type: Number },
        carbs: { type: Number },
        fat: { type: Number },
        protein: { type: Number },
        fiber: { type: Number },
      },
    ],
    dinner: [
      {
        date: { type: Date, default: new Date() },
        name: { type: String },
        calories: { type: Number },
        carbs: { type: Number },
        fat: { type: Number },
        protein: { type: Number },
        fiber: { type: Number },
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
