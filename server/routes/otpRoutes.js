const express = require("express");
const otpControllers = require("../controllers/otpControllers");
const router = express.Router();

// Main path - "/user"
router.get("/", otpControllers.showOTP);
router.get("/noUser", otpControllers.generateOTPnoUser);
router.post("/generate", otpControllers.generateOTP);

module.exports = router;
