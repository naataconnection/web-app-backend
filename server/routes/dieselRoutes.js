const express = require("express");
const router = express.Router();
const imageUpload = require("../utils/multer");
const dieselControllers = require("../controllers/dieselController");

// Main route - "/diesel"

router.post("/create", imageUpload.array('images'), dieselControllers.create);

router.post("/user", dieselControllers.dieselDetail);

// dashboard
router.post("/allUser", dieselControllers.allDieselDetails);
router.post("/sortByPump", dieselControllers.searchByPump);
router.post("/sortByPaymentMode", dieselControllers.searchByModeOfPayment);
router.post("/sortByVehicleNumber", dieselControllers.searchByVehicleNumber);
router.post("/sortByDate", dieselControllers.searchByDate);
router.post("/sortByDateAndUserCode", dieselControllers.searchByDateAndUserCode);
router.post("/sortByDateRange", dieselControllers.searchByDateRange);


router.post("/testAPI", imageUpload.single("file"), dieselControllers.testAPI);

module.exports = router;