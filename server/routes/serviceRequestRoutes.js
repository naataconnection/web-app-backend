const express = require("express");
const router = express.Router();
const serviceRequesControllers = require("../controllers/serviceRequestControllers");

router.post("/create", serviceRequesControllers.createRequest);
router.post("/approve", serviceRequesControllers.approveRequest);
router.post("/assign/manager", serviceRequesControllers.assignManager);
router.post("/assign/driversDB", serviceRequesControllers.assignDrivers);
router.post("/assign/driverToInvoice", serviceRequesControllers.assignDriverToInvoice);
router.post("/dispatch/driver", serviceRequesControllers.dispatchedDriver);
router.post("/delivered/driver", serviceRequesControllers.deliveredDriver);
module.exports = router;
