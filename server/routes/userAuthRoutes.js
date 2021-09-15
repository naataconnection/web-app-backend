const express = require("express");
const userAuthControllers = require("../controllers/userAuthController.js");
const { authRequired, forwardAuthenticated } = require("../middlewares/authMiddleware.js");
const router = express.Router();

// Main path - "/user"
router.post("/register", userAuthControllers.registerUser);
router.post("/login", forwardAuthenticated, userAuthControllers.loginUser);
router.post("/logout", userAuthControllers.logoutUser);
router.post("/verify", userAuthControllers.verifyUser);

module.exports = router;
