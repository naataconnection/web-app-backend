const express = require("express");
const router = express.Router();
const serviceRequesControllers = require("../controllers/serviceRequestControllers");

router.post("/createRequest", serviceRequesControllers.createRequest);

module.exports = router;
