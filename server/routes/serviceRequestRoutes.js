const express = require("express");
const router = express.Router();
const serviceRequesControllers = require("../controllers/serviceRequestControllers");

router.post("/createSuperUser", serviceRequesControllers.createRequestBySuperUser);
router.post("/createCustomer", serviceRequesControllers.createRequestByCustomer);
router.post("/approve", serviceRequesControllers.approveRequest);
router.post("/assign/manager", serviceRequesControllers.assignManager);
router.post("/assign/driversDB", serviceRequesControllers.assignDriversAndDB);
router.post("/create/order", serviceRequesControllers.createOrder);
router.post("/create/invoice", serviceRequesControllers.createInvoice);
router.post("/dispatch/driver", serviceRequesControllers.dispatchedDriver);
router.post("/deliver/driver", serviceRequesControllers.deliverDriver);
router.post("/close/manager", serviceRequesControllers.closeRequest);
module.exports = router;
