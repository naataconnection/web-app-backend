const express = require("express");
const router = express.Router();
const serviceRequesControllers = require("../controllers/serviceRequestControllers");

router.post("/create", serviceRequesControllers.createRequest);
router.post("/approve", serviceRequesControllers.approveRequest);
router.post("/assign/manager", serviceRequesControllers.assignManager);
router.post("/assign/drivers", serviceRequesControllers.assignDrivers);

module.exports = router;
