const express = require("express");
const router = express.Router();

const genericContactCnt = require("../controllers/genericContact.js");

router.post("/create", genericContactCnt.createOne);


module.exports = router