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
router.get("/activeUsers", serviceRequesControllers.getActiveServiceRequest);
router.get("/pendingUsers", serviceRequesControllers.getPendingServiceRequest);
router.get("/completedUsers", serviceRequesControllers.getCompletedServiceRequest);
router.post("/orders", ordersControllers.getOrder);
router.get("/invoices", invoicesControllers.getInvoice);

router.get("/", serviceRequesControllers.getServiceRequest);

// Dashboard
router.get("/all/active", serviceRequesControllers.getAllActiveServiceRequest);
router.get("/all/pending", serviceRequesControllers.getAllPendingServiceRequest);
router.get("/all/completed", serviceRequesControllers.getAllCompletedServiceRequest);

module.exports = router;
