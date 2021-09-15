const express = require("express");
const otpControllers = require("../controllers/otpController.js");
const router = express.Router();

// Main path - "/otp"
router.get("/", otpControllers.showOTP);
router.get("/noUser", otpControllers.generateOTPnoUser);
router.post("/generate", otpControllers.generateOTP);

module.exports = router;
