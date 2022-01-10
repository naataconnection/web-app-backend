require("dotenv").config();
const express = require("express");
const db = require("./db.js");
const app = express();
const passport = require("passport");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

const indexRoutes = require("./routes/index.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *');
  if (req.method === 'OPTIONS') {
     res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
     res.setHeader('Access-Control-Allow-Credentials', true);
     return res.status(200).json({});
  }
  next();
});
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(bodyParser.json({
  limit: '50mb',
  extended: true
}));

// Passport Configuration
require("./config/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", indexRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running at localhost:${process.env.PORT}`);
});
