const express = require("express");
const blockUserControllers = require("../controllers/blockUserController.js");
const router = require("./userAuthRoutes.js");

// Main - '/block'

router.post("/user", blockUserControllers.userBlock);
router.post("/superUser", blockUserControllers.superUserBlock);

module.exports = router;


