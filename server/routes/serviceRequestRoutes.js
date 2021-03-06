const express = require("express");
const router = express.Router();
const serviceRequesControllers = require("../controllers/serviceRequestControllers");
const ordersControllers = require("../controllers/orderController");
const invoicesControllers = require("../controllers/invoiceController");

router.post(
  "/createSuperUser",
  serviceRequesControllers.createRequestBySuperUser
);
router.post(
  "/createCustomer",
  serviceRequesControllers.createRequestByCustomer
);
router.post("/approve", serviceRequesControllers.approveRequest);
router.post("/assign/manager", serviceRequesControllers.assignManager);
router.post("/assign/driversDB", serviceRequesControllers.assignDriversAndDB);
router.post("/create/order", serviceRequesControllers.createOrder);
router.post("/create/invoice", serviceRequesControllers.createInvoice);
router.post("/dispatch/driver", serviceRequesControllers.dispatchedDriver);
router.post("/deliver/driver", serviceRequesControllers.deliverDriver);
router.post("/close/manager", serviceRequesControllers.closeRequest);
router.post("/activeUsers", serviceRequesControllers.getActiveServiceRequest, serviceRequesControllers.getwithName);
router.post("/pendingUsers", serviceRequesControllers.getPendingServiceRequest, serviceRequesControllers.getwithName);
router.post("/completedUsers", serviceRequesControllers.getCompletedServiceRequest, serviceRequesControllers.getwithName);
router.post("/orders", ordersControllers.getOrder);
router.post("/invoices", invoicesControllers.getInvoice);

router.post("/", serviceRequesControllers.getServiceRequest);

// Dashboard
router.post("/all/active", serviceRequesControllers.getAllActiveServiceRequest);
router.post("/all/pending", serviceRequesControllers.getAllPendingServiceRequest);
router.post("/all/completed", serviceRequesControllers.getAllCompletedServiceRequest);

module.exports = router;
