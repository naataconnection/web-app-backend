const express = require("express");
const vendorContactCnt = require("../controllers/vendorContactController.js");
const router = express.Router();

// Main path - "/vendorContact"
router.post("/create", vendorContactCnt.createOne);

module.exports = router;