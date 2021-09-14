require("dotenv").config();
const express = require("express");
const db = require("./db.js");
const app = express();
const passport = require("passport");
const morgan = require("morgan");
const cors = require("cors"); 

const userAuthRoutes = require("./routes/userAuthRoutes.js");
const otpRoutes = require("./routes/otpRoutes.js");
const verificationEmailRoutes = require("./routes/verificationEmailRoutes.js");
const { authRequired, forwardAuthenticated } = require("./middlewares/authMiddlewares.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Passport Configuration
require("./config/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("<h1>Helloooo</h1>");
});
app.get("/secret", authRequired, (req, res) => {
  res.send("Secret Found");
});

app.use("/user",userAuthRoutes);
app.use("/otp",otpRoutes);
app.use("/email",verificationEmailRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running at localhost:${process.env.PORT}`);
});
	
	