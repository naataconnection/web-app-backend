const express = require("express");
const router = express.Router();
const imageUpload = require("../utils/multer");
const dieselControllers = require("../controllers/dieselController");

// Main route - "/diesel"

router.post("/create", imageUpload.array('images'), dieselControllers.create);
router.get("/user", dieselControllers.dieselDetail);

// dashboard
router.get("/allUser", dieselControllers.allDieselDetails);
router.get("/sortByPump", dieselControllers.searchByPump);
router.get("/sortByPaymentMode", dieselControllers.searchByModeOfPayment);
router.get("/sortByVehicleNumber", dieselControllers.searchByVehicleNumber);
router.get("/sortByDate", dieselControllers.searchByDate);
router.get("/sortByDateAndUserCode", dieselControllers.searchByDateAndUserCode);
router.get("/sortByDateRange", dieselControllers.searchByDateRange);

module.exports = router;