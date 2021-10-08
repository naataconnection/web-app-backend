const express = require("express");
const router = express.Router();

const getUserHelper = require("../helpers/getUserList");

// Main - "/users"

router.get("/userList", getUserHelper.getUsersList);
router.get("/profile", getUserHelper.getUserProfile);

module.exports = router;