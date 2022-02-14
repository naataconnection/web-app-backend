const express = require("express");
const genericContactCnt = require("../controllers/genericContactController.js");
const router = express.Router();

// Main path - "/genericContact"
router.post("/create", genericContactCnt.createOne);
router.get("/all", genericContactCnt.getAll);

module.exports = router;
