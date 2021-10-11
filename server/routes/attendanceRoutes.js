const express = require("express");
const router = express.Router();

const attendanceCnt = require("../controllers/attendance.js");
const attendanceDashboardCnt = require("../controllers/attendanceDashboard");
const attendanceDownloadCnt = require("../controllers/attendanceDownload");

// Main route - '/attendance'

router.get("/addUserList", attendanceCnt.employees);
router.patch("/markPresent", attendanceCnt.markAttendance);
router.patch("/endtheDay", attendanceCnt.endDay);

// Dashboard routes
router.post("/getReportByDateAndUserCode", attendanceDashboardCnt.getAttendanceReportByDateAndUserCode);
router.post("/getReportByDate", attendanceDashboardCnt.getAttendanceReportByDate);
router.delete("/clearDashboard", attendanceDashboardCnt.deleteUserStats);
router.delete("/deleteUser", attendanceDashboardCnt.deleteUser);

// attendance report routes
router.post("/download", attendanceDownloadCnt.createUserXls);


module.exports = router