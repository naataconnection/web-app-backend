const express = require("express");
const router = express.Router();

const getSuperUserHelper = require("../helpers/getSuperUser");

// Main - "/superUsers"

router.get("/profile", getSuperUserHelper.getSuperUserProfile);
router.get("/admin", getSuperUserHelper.getAdmin);

module.exports = router;