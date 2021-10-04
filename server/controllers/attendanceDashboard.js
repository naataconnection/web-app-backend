const attendance = require("../models/attendance");
const userStat = require("../models/userStat");
const manager = require("../models/manager");
const driver = require("../models/driver");
const deliveryBoy = require("../models/deliveryBoy");


// on adding user by add user
module.exports.getAttendanceReportByDateAndUserCode = async (req, res) => {
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
            }).sort({ date: 'asc'})
   
        if(!result) {
            return res.status(404).json({
             status:'failure',
             message:'Data doesn\'t exist'
            })
        } 

        var dateOfJoining, dateOfTermination; 
        if(req.body.userCode[5] == "1"){
            const output = await manager.find({userCode: req.body.userCode}).select({"dateOfJoining": 1, "dateOfTermination": 1});
            if(output){
                dateOfJoining = output[0].dateOfJoining;
                dateOfTermination = output[0].dateOfTermination;
            }else{
                return res.status(404).json({
                    status:'failure',
                    message:'User doesn\'t exist'
                })
            }
        }else if(req.body.userCode[5] == "2"){
            const output = await driver.find({userCode: req.body.userCode}).select({"dateOfJoining": 1, "dateOfTermination": 1});
            if(output){
                dateOfJoining = output[0].dateOfJoining;
                dateOfTermination = output[0].dateOfTermination;
            }else{
                return res.status(404).json({
                    status:'failure',
                    message:'User doesn\'t exist'
                })
            }
        }else if(req.body.userCode[5] == "3"){
            const output = await deliveryBoy.find({userCode: req.body.userCode}).select({"dateOfJoining": 1, "dateOfTermination": 1});
            if(output){
                dateOfJoining = output[0].dateOfJoining;
                dateOfTermination = output[0].dateOfTermination;
            }else{
                return res.status(404).json({
                    status:'failure',
                    message:'User doesn\'t exist'
                })
            }
        }else{
            return res.status(404).json({
                status:'failure',
                message:'User Code doesn\'t defined'
            })
        }

         // add userCode in dummy table called userStat
         await userStat.create({userCode: req.body.userCode, dateOfJoining: dateOfJoining, dateOfTermination: dateOfTermination});

        // For Present status
        var present = 0, workingSunday = 0, totalSunday = 0;
        var differenceInTime = new Date(endDate).getTime() - new Date(startDate).getTime();
        var totalDays = differenceInTime/(1000*3600*24);
        totalDays++;
        for(var i = 0;i < result.length; i++){
            if(result[i].attendance_status == 1){
                present++;
            }
            if(result[i].day == "Sunday"){
                totalSunday++;
                if(result[i].attendance_status == 1){
                    workingSunday++;
                }
            }
        }
        res.status(200).json({
            status:'success',
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
        if(error.code == 11000){
            res.status(400).json({success: "false", error: `User already added in the attendance dashboard`});
        }
        res.status(400).json({ success: "false", error: `${error}` });
    }
}

module.exports.getAttendanceReportByDate = async (req, res) => {
    try{
        var final = [];
        const userList = await userStat.find({});
        for(var i = 0;i < userList.length; i++){
            var userCode = userList[i].userCode;
            var dateOfJoining = userList[i].dateOfJoining;
            var dateOfTermination = userList[i].dateOfTermination;
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
                userCode: userCode,
                }).sort({ date: 'asc'})  
   
            if(!result) {
                return res.status(404).json({
                status:'failure',
                message:'Data doesn\'t exist'
                })
            } 
          
            var present = 0, workingSunday = 0, totalSunday = 0;
            var differenceInTime = new Date(endDate).getTime() - new Date(startDate).getTime();
            var totalDays = differenceInTime/(1000*3600*24);
            totalDays++;
            for(var i = 0;i < result.length; i++){
                if(result[i].attendance_status == 1){
                    present++;
                }
                if(result[i].day == "Sunday"){
                    totalSunday++;
                    if(result[i].attendance_status == 1){
                        workingSunday++;
                    }
                }
            }

            final[userCode] = {present, totalSunday, workingSunday, totalDays, dateOfJoining, dateOfTermination, result};
        }

        res.status(200).json({
            status:'success',
            data: Object.assign({}, final)
        }); 
    }catch(error){
        console.log(error);
        res.status(400).json({ success: "false", error: `${error}` });
    }
}

module.exports.deleteUserStats = async (req, res) => {
    try{
        await userStat.deleteMany({});
        res.status(200).json({status: "true", message:"Dashboard Clean Up"});
    }catch(error){
        console.log(error);
        res.status(400).json({ success: "false", error: `${error}` });
    }
}