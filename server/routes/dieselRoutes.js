const express = require("express");
const router = express.Router();
const imageUpload = require("../utils/multer");
const dieselControllers = require("../controllers/dieselController");

// Main route - "/diesel"

router.post("/create", imageUpload.array('images'), dieselControllers.create);

module.exports = router;