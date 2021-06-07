const mongoose = require("mongoose");
const { Schema } = require("mongoose");

mongoose.Schema.promise = global.Promise;

mongoose.set("useCreateIndex", true);
const url = "";

const loginCollection = Schema(
  {
    mobile: { type: String },
    password: { type: String },
    name: { type: String },
  },
  { collection: "loginCollection" }
);

let collection = {};

collection.getLoginCreds = async () => {
  try {
    let database = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let model = await database.model("loginCollection", loginCollection);

    return model;
  } catch {
    let error = new Error("DB connection failed");
    error.status = 500;
    throw error;
  }
};
module.exports = collection;
