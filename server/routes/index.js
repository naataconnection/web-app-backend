const express = require("express");
const genericContact = require("./genericContact");
const vendorContact = require("./vendorContact");

const router = express.Router();

router.use("/genericContact", genericContact);
router.use("/vendorContact", vendorContact);


module.exports = router;