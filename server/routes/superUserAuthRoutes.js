const express = require("express");
const superUserRegistrationControllers = require("../controllers/superUserRegistrationController.js");
const superUserLoginControllers = require("../controllers/superUserLoginController.js");
const otpControllers = require("../controllers/otpController.js");
const { authRequired, forwardAuthenticated, verifyUser } = require("../middlewares/authMiddleware.js");
const router = express.Router();

// Main path - "/superUser"

//superUserRegistrationController
router.post("/registerSuperUser", superUserRegistrationControllers.registerSuperUser);

//superUserLoginController
router.post("/login_checkSuperUserAndSendOtp", superUserLoginControllers.loginSuperUser_checkSuperUser, otpControllers.generateAndSendOTPForSuperUser);
router.post("/login_verifyOtp", forwardAuthenticated, superUserLoginControllers.loginSuperUser_verifyOtp);
router.post("/logout", superUserLoginControllers.logoutSuperUser);


module.exports = router;
