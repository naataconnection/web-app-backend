const express = require("express");
const router = express.Router();

const userLiveLocationCnt = require("../controllers/userLiveLocationController");

// Main route - '/userLiveLocation'

router.patch("/update", userLiveLocationCnt.updateLiveLocation);

module.exports = router

