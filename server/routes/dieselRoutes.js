const express = require("express");
const router = express.Router();
const imageUpload = require("../utils/multer");
const dieselControllers = require("../controllers/dieselController");

// Main route - "/diesel"

router.post("/create", imageUpload.array('images'), dieselControllers.create);
router.get("/user", dieselControllers.user);

// dashboard
router.get("/allUser", dieselControllers.allUsers);
router.get("/sortByPump", dieselControllers.sortByPump);
router.get("/sortByPaymentMode", dieselControllers.sortByModeOfPayment);
router.get("/sortByVehicleNumber", dieselControllers.sortByVehicleNumber);
router.get("/sortByDate", dieselControllers.sortByDate);
router.get("/sortByDateAndUserCode", dieselControllers.sortByDateAndUserCode);
router.get("/sortByDateRange", dieselControllers.sortByDateRange);

module.exports = router;