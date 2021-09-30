const express = require("express");
const userAuthControllers = require("../controllers/userAuthController.js");
const otpControllers = require("../controllers/otpController.js");
const { authRequired, forwardAuthenticated } = require("../middlewares/authMiddleware.js");
const router = express.Router();

// Main path - "/user"
router.post("/register", userAuthControllers.registerUser);
router.post("/login_checkUserAndSendOtp", userAuthControllers.loginUser_checkUser, otpControllers.generateAndSendOTP);
router.post("/login_verifyOtp",forwardAuthenticated, userAuthControllers.loginUser_verifyOtp);
router.post("/registerDriver", userAuthControllers.registerDriver);
router.post("/registerManager", userAuthControllers.registerManager);
router.post("/registerDeliveryBoy", userAuthControllers.registerDeliveryBoy);
// router.post("/login", forwardAuthenticated, userAuthControllers.loginUser);
router.post("/logout", userAuthControllers.logoutUser);
router.post("/verify", userAuthControllers.verifyUser);

module.exports = router;
