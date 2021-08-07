const mongoose = require("mongoose");
const { Schema } = require("mongoose");
mongoose.Schema.promise = global.promise;
mongoose.set("useCreateIndex", true);

require("dotenv").config();
const url = process.env.KEY;

const foodData = Schema(
  {
    category: { type: String },
    date: { type: Date, default: new Date() },
    name: { type: String },
    calories: { type: Number },
    carbs: { type: Number },
    fat: { type: Number },
    fiber: { type: Number },
    protien: { type: Number },
  },
  { collection: "foodData" }
);

let collection = {};

collection.getFoodData = async () => {
  try {
    let database = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let model = await database.model("foodData", foodData);
    return model;
  } catch {
    let err = new Error("connection failed");
    error.status = 500;
    throw error;
  }
};
module.exports = collection;
