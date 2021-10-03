const express = require("express");
const blockUserControllers = require("../controllers/blockUserController.js");
const router = express.Router();




router.post("/user", blockUserControllers.userBlock);
router.post("/superUser", blockUserControllers.superUserBlock);

module.exports = router;


