const express = require("express");
const router = express.Router();
const imageUpload = require("../utils/multer");

const notificationController = require("../controllers/notificationController");

// Main route - "/notification"

router.post("/create", imageUpload.array('images'), notificationController.create);
router.get("/getAll", notificationController.getNotification);

module.exports = router;