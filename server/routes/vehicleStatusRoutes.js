const express = require("express");
const router = express.Router();

const vehicleStatusCnt = require("../controllers/vehicleStatus");

// Main route - '/vehicle'

router.get("/getAll", vehicleStatusCnt.getAllVehicle);
router.get("/getbyid", vehicleStatusCnt.getVehiclebyId);

module.exports = router