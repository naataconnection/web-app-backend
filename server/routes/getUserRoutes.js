const express = require("express");
const router = express.Router();

const getUserHelper = require("../helpers/getUserList");

// Main - "/users"

router.get("/userList", getUserHelper.getUsersList);
router.get("/profile", getUserHelper.getUserProfile);
router.get("/driver", getUserHelper.getDriver);
router.get("/deliveryBoy", getUserHelper.getDeliveryBoy);
router.get("/customer", getUserHelper.getCustomer);
router.get("/manager", getUserHelper.getManager);

module.exports = router;