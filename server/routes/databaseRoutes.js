const express = require("express");
const dbControllers = require("../helpers/db");
const router = express.Router();

// Main - '/db'

router.post("/export", dbControllers.exportDB);

module.exports = router;


