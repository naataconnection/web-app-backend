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
router.get("/allDriver", getUserHelper.allDriver);
router.get("/allDeliveryBoy", getUserHelper.allDeliveryBoy);
router.get("/allManagerwithName", getUserHelper.allManagerwithName);
router.get("/allDriverwithName", getUserHelper.allDriverwithName);
router.get("/allDeliveryBoywithName", getUserHelper.allDriverwithName);
router.get("/allCustomerwithName", getUserHelper.allDriverwithName);
router.get("/", getUserHelper.users);

module.exports = router;