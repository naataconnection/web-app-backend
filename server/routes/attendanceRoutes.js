const express = require("express");
const router = express.Router();

const attendanceCnt = require("../controllers/attendance.js");
const attendanceDashboardCnt = require("../controllers/attendanceDashboard");
const attendanceDownloadCnt = require("../controllers/attendanceDownload");

// Main route - '/attendance'

router.post("/addUserList", attendanceCnt.addEmployes);
router.patch("/markPresent", attendanceCnt.markAttendance);
router.patch("/endtheDay", attendanceCnt.endDay);

// Dashboard routes
router.post("/getReportAllUsers", attendanceDashboardCnt.getAttendanceReportAllUsers);

// attendance report routes
router.post("/download", attendanceDownloadCnt.createUserXls);


module.exports = router