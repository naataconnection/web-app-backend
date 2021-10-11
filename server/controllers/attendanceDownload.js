const excel = require('exceljs')
const workbook = new excel.Workbook();
const attendance = require("../models/attendance");
const manager = require("../models/manager");
const driver = require("../models/driver");
const deliveryBoy = require("../models/deliveryBoy");

module.exports.createUserXls = async (req, res) => {

    const users = workbook.addWorksheet('Attendance Report');
    const A = 'A'
    const B = 'B'

    let rowNo = 1
    users.getCell(A + rowNo).value = "Date"
    users.getCell(B + rowNo).value = "Attendance Status"
    rowNo++;

    try {
        var startDate = req.body.startDate;
        var endDate = req.body.endDate;

        console.log(startDate, endDate);

        if (startDate === '' || endDate === '') {
            return res.status(400).json({
                success: "false",
                message: 'Please ensure you pick two dates'
            })
        }

        const result = await attendance.find({
            date: {
                $gte: startDate,
                $lte: endDate
            },
            userCode: req.body.userCode,
        }).sort({ date: 'asc' })

        if (!result) {
            return res.status(404).json({
                status: 'failure',
                message: 'Data doesn\'t exist'
            })
        }

        var dateOfJoining, dateOfTermination;
        if (req.body.userCode[5] == "1") {
            const output = await manager.find({ userCode: req.body.userCode }).select({ "dateOfJoining": 1, "dateOfTermination": 1 });
            if (output) {
                dateOfJoining = output[0].dateOfJoining;
                dateOfTermination = output[0].dateOfTermination;
            } else {
                return res.status(404).json({
                    status: 'failure',
                    message: 'User doesn\'t exist'
                })
            }
        } else if (req.body.userCode[5] == "2") {
            const output = await driver.find({ userCode: req.body.userCode }).select({ "dateOfJoining": 1, "dateOfTermination": 1 });
            if (output) {
                dateOfJoining = output[0].dateOfJoining;
                dateOfTermination = output[0].dateOfTermination;
            } else {
                return res.status(404).json({
                    status: 'failure',
                    message: 'User doesn\'t exist'
                })
            }
        } else if (req.body.userCode[5] == "3") {
            const output = await deliveryBoy.find({ userCode: req.body.userCode }).select({ "dateOfJoining": 1, "dateOfTermination": 1 });
            if (output) {
                dateOfJoining = output[0].dateOfJoining;
                dateOfTermination = output[0].dateOfTermination;
            } else {
                return res.status(404).json({
                    status: 'failure',
                    message: 'User doesn\'t exist'
                })
            }
        } else {
            return res.status(404).json({
                status: 'failure',
                message: 'User Code doesn\'t defined'
            })
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

        console.log(result);

        var tempStartDate = startDate;
        var inr = 0;

        while(tempStartDate <= endDate){
            if(tempStartDate < dateOfJoining){ // before joining
                //blank
                users.getCell(A + rowNo).value = tempStartDate;
                users.getCell(B + rowNo).value = "-"
            }
            if(tempStartDate >= dateOfJoining){
                if(tempStartDate <= dateOfTermination){
                    users.getCell(A + rowNo).value = tempStartDate;
                    if(tempStartDate == result[inr].date && inr < result.length){
                        users.getCell(B + rowNo).value = result[inr].attendance_status;
                        inr++;
                    }
                }else{
                    // blank
                    users.getCell(A + rowNo).value = tempStartDate;
                    users.getCell(B + rowNo).value = "-"
                }
            }
            rowNo++;
            var inr_date = new Date(tempStartDate);
            var new_date = new Date(inr_date.setDate(inr_date.getDate() + 1)); 
            tempStartDate = new_date.toISOString().substr(0, 10);      
        }

        res.status(200).json({
            status: 'success',
            present: present,
            absent: totalDays - present,
            totalSunday: totalSunday,
            workingSunday: workingSunday,
            totalDays: totalDays,
            dateOfJoining: dateOfJoining,
            dateOfTermination: dateOfTermination,
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: "false", error: `${error}` });
    }

    // col - sno, date, attendance_status

}