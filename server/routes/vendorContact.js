const express = require("express");
const router = express.Router();

const vendorContactCnt = require("../controllers/vendorContact.js");


router.post("/create", vendorContactCnt.createOne);


module.exports = router;