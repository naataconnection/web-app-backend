require("dotenv").config();
const express = require("express");
const db = require("./db.js");
const app = express();
const passport = require("passport");

const route = require("./routes/index.js");

app.use(express.json());

// Passport Configuration
require("./config/passport")(passport);

app.use("/", route);

app.get("/", (req, res) => {
  res.send("<h1>Helloooo</h1>");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
