const express = require("express");
const userLoginControllers = require("../controllers/userLoginController.js");
const userRegistrationControllers = require("../controllers/userRegistrationController.js");
const otpControllers = require("../controllers/otpController.js");
const { authRequired, forwardAuthenticated, verifyUser } = require("../middlewares/authMiddleware.js");
const router = express.Router();

// Main path - "/user"

//userLoginController
router.post("/login_checkUserAndSendOtp", userLoginControllers.loginUser_checkUser, otpControllers.generateAndSendOTPForUser);
router.post("/login_verifyOtp",forwardAuthenticated, userLoginControllers.loginUser_verifyOtp);
router.post("/logout", userLoginControllers.logoutUser);

//userRegistrationController
router.post("/register", userRegistrationControllers.registerUser);
router.post("/registerDriver", userRegistrationControllers.registerDriver);
router.post("/registerManager", userRegistrationControllers.registerManager);
router.post("/registerDeliveryBoy", userRegistrationControllers.registerDeliveryBoy);
router.post("/registerCustomer", userRegistrationControllers.registerCustomer);

module.exports = router;
