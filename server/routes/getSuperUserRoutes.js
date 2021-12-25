const express = require("express");
const router = express.Router();

const getSuperUserHelper = require("../helpers/getSuperUser");

// Main - "/superUsers"

router.post("/profile", getSuperUserHelper.getSuperUserProfile);
router.post("/admin", getSuperUserHelper.getAdmin);
router.post("/", getSuperUserHelper.allsuperUser);
router.post("/allAdmin", getSuperUserHelper.allAdmin);
router.post("/allOwner", getSuperUserHelper.allOwner);

module.exports = router;