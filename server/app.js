require("dotenv").config();
const express = require("express");
const db = require("./db.js");
const app = express();
const passport = require("passport");
const morgan = require("morgan");
const cors = require("cors");
const jwt = require('express-jwt');
const jsonwebtoken = require("jsonwebtoken");

const route = require("./routes/index.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Passport Configuration
require("./config/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", route);

app.get("/", (req, res) => {
  res.send("<h1>Helloooo</h1>");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at localhost:${process.env.PORT}`);
});
	
	