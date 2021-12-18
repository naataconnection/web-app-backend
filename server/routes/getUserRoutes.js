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

module.exports = router;