const express = require("express");
const userLoginControllers = require("../controllers/userLoginController.js");
const userRegistrationControllers = require("../controllers/userRegistrationController.js");
const superUserRegistrationControllers = require("../controllers/superUserRegistrationController.js");
const otpControllers = require("../controllers/otpController.js");
const { authRequired, forwardAuthenticated } = require("../middlewares/authMiddleware.js");
const router = express.Router();

// Main path - "/user"

//userLoginController
router.post("/login_checkUserAndSendOtp", userLoginControllers.loginUser_checkUser, otpControllers.generateAndSendOTP);
router.post("/login_verifyOtp",forwardAuthenticated, userLoginControllers.loginUser_verifyOtp);
router.post("/logout", userLoginControllers.logoutUser);
router.post("/verify", userLoginControllers.verifyUser);

//userRegistrationController
router.post("/register", userRegistrationControllers.registerUser);
router.post("/registerDriver", userRegistrationControllers.registerDriver);
router.post("/registerManager", userRegistrationControllers.registerManager);
router.post("/registerDeliveryBoy", userRegistrationControllers.registerDeliveryBoy);
router.post("/registerCustomer", userRegistrationControllers.registerCustomer);
// router.post("/login", forwardAuthenticated, userAuthControllers.loginUser);

//superUserRegistrationController
router.post("/registerSuperUser", superUserRegistrationControllers.registerSuperUser);


module.exports = router;
