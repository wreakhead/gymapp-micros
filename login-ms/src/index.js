const express = require("express");
const router = require("./routes");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();

const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());
app.use("/", router);

app.get("/", (req, res) => {
  res.send("login service started");
});

app.listen(PORT, () => {
  console.log("server @ 7000");
});

module.exports = app;
