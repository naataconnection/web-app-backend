const express = require("express");
const userAuthControllers = require("../controllers/userAuthControllers");
const { authRequired, forwardAuthenticated } = require("../middlewares/authMiddlewares");
const router = express.Router();

// Main path - "/user"
router.post("/register", userAuthControllers.registerUser);
router.post("/login", forwardAuthenticated, userAuthControllers.loginUser);
router.post("/logout", userAuthControllers.logoutUser);

module.exports = router;
