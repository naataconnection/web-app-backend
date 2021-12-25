const express = require("express");
const router = express.Router();

const vehicleStatusCnt = require("../controllers/vehicleStatus");

// Main route - '/vehicle'

router.post("/getAll", vehicleStatusCnt.getAllVehicle);
router.post("/getbyId", vehicleStatusCnt.getVehiclebyId);

module.exports = router