const express = require("express");
const router = express.Router();

const getUserHelper = require("../helpers/getUserList");

// Main - "/users"

router.post("/userList", getUserHelper.getUsersList);
router.post("/profile", getUserHelper.getUserProfile);
router.post("/driver", getUserHelper.getDriver);
router.post("/deliveryBoy", getUserHelper.getDeliveryBoy);
router.post("/customer", getUserHelper.getCustomer);
router.post("/manager", getUserHelper.getManager);
router.post("/allDriver", getUserHelper.allDriver);
router.post("/allDeliveryBoy", getUserHelper.allDeliveryBoy);
router.post("/allManagerwithName", getUserHelper.allManagerwithName);
router.post("/allDriverwithName", getUserHelper.allDriverwithName);
router.post("/allDeliveryBoywithName", getUserHelper.allDeliveryBoywithName);
router.post("/allCustomerwithName", getUserHelper.allCustomerwithName);
router.post("/", getUserHelper.users);

module.exports = router;