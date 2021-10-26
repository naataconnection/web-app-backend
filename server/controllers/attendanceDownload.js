const excel = require('exceljs')
const attendance = require("../models/attendance");
const manager = require("../models/manager");
const driver = require("../models/driver");
const deliveryBoy = require("../models/deliveryBoy");
const uploadFile = require("../utils/gCloud").uploadFile;
const fs = require("fs");

module.exports.createUserXls = async (req, res) => {

    const workbook = new excel.Workbook();
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
        console.log(result);
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
        console.log(dateOfJoining);
        var tempStartDate = startDate;
        var inr = 0;

        while(tempStartDate <= endDate){
            if(tempStartDate < dateOfJoining){ // before joining
                //blank
                users.getCell(A + rowNo).value = tempStartDate;
                users.getCell(B + rowNo).value = "-"
                console.log("Archana");
            }
            if(tempStartDate >= dateOfJoining){
                if(dateOfTermination === null){
                    users.getCell(A + rowNo).value = tempStartDate;
                    if(tempStartDate == result[inr].date && inr < result.length){
                        users.getCell(B + rowNo).value = result[inr].attendance_status ? "Present" : "Absent";
                        console.log(result[inr]);
                        inr++;
                    }
                }else{
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
            }
            rowNo++;
            var inr_date = new Date(tempStartDate);
            var new_date = new Date(inr_date.setDate(inr_date.getDate() + 1)); 
            tempStartDate = new_date.toISOString().substr(0, 10);  
            console.log(tempStartDate);    
        }

        const fileName = "attendanceReport_" + req.body.userCode + ".xls"
        const loc = __dirname + '/../../public/attendanceReport/' + fileName;
        await workbook.xlsx.writeFile(loc);

        var destPath = "attendanceReport/" + fileName;

        let publicUrl = uploadFile(loc, destPath);
        publicUrl = await Promise.all([publicUrl])
        fs.unlinkSync(loc);

        res.status(200).json({
            status: 'success',
            link: publicUrl[0],
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: "false", error: `${error}` });
    }

    // col - sno, date, attendance_status

}