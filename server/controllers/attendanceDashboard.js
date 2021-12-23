const attendance = require("../models/attendance");
const manager = require("../models/manager");
const driver = require("../models/driver");
const deliveryBoy = require("../models/deliveryBoy");

const getAttendanceReport = async (userCode, startDate, endDate) => {

    const result = await attendance.find({
        date: {
            $gte: startDate,
            $lte: endDate
        },
        userCode: userCode,
    }).sort({ date: 'asc' })

    if (!result) {
        return res.status(404).json({
            status: 'failure',
            message: 'Data doesn\'t exist'
        })
    }

    var report = {};

    var dateOfJoining, dateOfTermination;
    if (userCode[5] == "1") {
        const output = await manager.find({ userCode: userCode }).select({ "dateOfJoining": 1, "dateOfTermination": 1 });
        if (output) {
            dateOfJoining = output[0].dateOfJoining;
            dateOfTermination = output[0].dateOfTermination;
        } else {
            report["status"] = "false";
            report["userCode"] = userCode;
            report["message"] = 'User doesn\'t exist';
            return report;
        }
    } else if (userCode[5] == "2") {
        const output = await driver.find({ userCode: userCode }).select({ "dateOfJoining": 1, "dateOfTermination": 1 });
        if (output) {
            dateOfJoining = output[0].dateOfJoining;
            dateOfTermination = output[0].dateOfTermination;
        } else {
            report["status"] = "false";
            report["userCode"] = userCode;
            report["message"] = 'User doesn\'t exist';
            return report;
        }
    } else if (userCode[5] == "3") {
        const output = await deliveryBoy.find({ userCode: userCode }).select({ "dateOfJoining": 1, "dateOfTermination": 1 });
        if (output) {
            dateOfJoining = output[0].dateOfJoining;
            dateOfTermination = output[0].dateOfTermination;
        } else {
            report["status"] = "false";
            report["userCode"] = userCode;
            report["message"] = 'User doesn\'t exist';
            return report;
        }
    } else {
        report["status"] = "false";
        report["userCode"] = userCode;
        report["message"] = 'User Code doesn\'t defined';
        return report;
    }

    // For Present status
    var present = 0, workingSunday = 0, totalSunday = 0;
    var differenceInTime = new Date(endDate).getTime() - new Date(startDate).getTime();
    var totalDays = differenceInTime / (1000 * 3600 * 24);
    totalDays++;
    for (var i = 0; i < result.length; i++) {
        if (result[i].attendance_status == 1) {
            present++;
        }
        if (result[i].day == "Sunday") {
            totalSunday++;
            if (result[i].attendance_status == 1) {
                workingSunday++;
            }
        }
    }

    report["status"] = "true";
    report["userCode"] = userCode;
    report["present"] = present;
    report["absent"] = totalDays - present;
    report["totalSunday"] = totalSunday;
    report["workingSunday"] = workingSunday;
    report["totalDays"] = totalDays;
    report["dateOfJoining"] = dateOfJoining;
    report["dateOfTermination"] = dateOfTermination;
    report["data"] = result;

    return report;
}

module.exports.getAttendanceReportAllUsers = async (req, res) => {
    try{
        var startDate = req.body.startDate;
        var endDate = req.body.endDate;

        console.log(startDate, endDate);

        if (startDate === '' || endDate === '') {
            return res.status(400).json({
                success: "false",
                message: 'Please ensure you pick two dates'
            })
        }

        var reports = [];

        const userCodes = req.body.userCode;
        if(userCodes.length > 0){
            for(let i = 0;i < userCodes.length; i++){
                const r = await getAttendanceReport(userCodes[i], startDate, endDate);
                reports.push(r);
            } 
        }
        return res.status(200).json({success: "true", data: reports});

    }catch(error){
        console.log(error);
        if (error.code == 11000) {
            res.status(400).json({ success: "false", error: `User already added in the attendance dashboard` });
        }
        res.status(400).json({ success: "false", error: `${error}` });
    }
}
