const express = require("express");
const router = require("./routes");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 7001;

app.use(cors());
app.use(express.json());
app.use("/", router);

app.get("/", (req, res) => {
  res.send("service started");
});

app.listen(PORT, () => {
  console.log("sserver @ 7001");
});

module.exports = app;
