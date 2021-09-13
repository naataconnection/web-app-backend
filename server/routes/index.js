const express = require("express");

const controllers = require("../controllers/controllers");
const {
  authRequired,
  forwardAuthenticated,
} = require("../middlewares/middlewares");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Helloooo</h1>");
});
router.post("/responseEmail", controllers.responseEmail);
router.post("/user/register", forwardAuthenticated, controllers.registerUser);
router.post("/user/login", forwardAuthenticated, controllers.loginUser);
router.get("/secret", authRequired, (req, res) => {
  res.send("Secret Found");
});
router.get("/otp", controllers.showOTP);
router.get("/otp/noUser", controllers.generateOTPnoUser);
router.get("/otp/generate/:id", controllers.generateOTP);

module.exports = router;
