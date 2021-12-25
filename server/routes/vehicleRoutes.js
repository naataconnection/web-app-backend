const express = require("express");
const router = express.Router();

const vehicleControllers = require("../controllers/vehicleControllers");
const blockVehicleControllers = require("../controllers/blockVehicleController");

//main router - /vehicle

router.post("/register", vehicleControllers.registerVehicle);
router.post("/block", blockVehicleControllers.vehicleBlock);
router.post("/all", vehicleControllers.getVehicles);
router.post("/", vehicleControllers.allVehicles);

module.exports = router;