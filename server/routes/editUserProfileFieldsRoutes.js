const express = require("express");
const editUserProfileFieldsController = require("../controllers/editUserProfileFieldsController.js");
const otpControllers = require("../controllers/otpController.js");
const { authRequired, forwardAuthenticated, verifyUser } = require("../middlewares/authMiddleware.js");
const router = express.Router();

// Main path - "/user/edit"

router.post("/sendOtp", verifyUser, otpControllers.generateAndSendOTPForUser_ToNewEmailIdOrContact );
router.post("/verifyOtpAndUpdateField", otpControllers.verifyOtp, editUserProfileFieldsController.updateEmailIdOrContact);


module.exports = router;