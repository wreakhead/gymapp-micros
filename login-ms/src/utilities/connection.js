const mongoose = require("mongoose");
const { Schema } = require("mongoose");

mongoose.Schema.promise = global.Promise;

mongoose.set("useCreateIndex", true);
const url = "mongodb+srv://gymService:HbLvtLv5k3GPCb68@cluster0.he1vq.mongodb.net/gymDB?retryWrites=true&w=majority";
const loginCollection = Schema(
  {
    date: { type: Date },
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
