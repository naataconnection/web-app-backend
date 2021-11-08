const express = require("express");
const userLoginControllers = require("../controllers/userLoginController.js");
const userRegistrationControllers = require("../controllers/userRegistrationController.js");
const otpControllers = require("../controllers/otpController.js");
const { authRequired, forwardAuthenticated, verifyUser } = require("../middlewares/authMiddleware.js");
const router = express.Router();
const imageUpload = require("../utils/multer");

// Main path - "/user"

//userLoginController
router.post("/login_checkUserAndSendOtp", userLoginControllers.loginUser_checkUser, otpControllers.generateAndSendOTPForUser);
router.post("/login_verifyOtp",forwardAuthenticated, userLoginControllers.loginUser_verifyOtp);
router.post("/logout", userLoginControllers.logoutUser);

//userRegistrationController
router.post("/register", userRegistrationControllers.registerUser);
router.post("/registerDriver", imageUpload.array('images'), userRegistrationControllers.registerDriver);
router.post("/registerManager", imageUpload.single('image'), userRegistrationControllers.registerManager);
router.post("/registerDeliveryBoy", imageUpload.array('images'), userRegistrationControllers.registerDeliveryBoy);
router.post("/registerCustomer", userRegistrationControllers.registerCustomer);

module.exports = router;
