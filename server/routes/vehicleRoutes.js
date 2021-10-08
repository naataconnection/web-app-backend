const express = require("express");
const router = express.Router();

const vehicleControllers = require("../controllers/vehicleControllers");

//main router - /vehicle

router.post("/register", vehicleControllers.registerVehicle)

module.exports = router;