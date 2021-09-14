const express = require("express");
const verificationEmailControllers = require("../controllers/verificationEmailControllers");
const router = express.Router();

// Main path - "/email"
router.post("/response", verificationEmailControllers.responseEmail);
router.post("/send", verificationEmailControllers.sendVerificationEmail);
router.get("/verify", verificationEmailControllers.verifyVerificationEmail);

module.exports = router;
