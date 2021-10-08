const express = require("express");
const router = express.Router();

const ownerFleetHuntCnt = require("../controllers/ownerFleetHuntController");

// Main route - '/ownerFleetHunt'

router.post("/create", ownerFleetHuntCnt.create);
router.patch("/update", ownerFleetHuntCnt.update);
router.get("/getData", ownerFleetHuntCnt.getData);

module.exports = router