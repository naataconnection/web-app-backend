const attendance = require("../models/attendance");
const geolocation = require("../utils/geoLocation");
const users = require("../models/user");
const dateTime = require("../utils/dateTimeFormat").dateDayTime;
const cron = require('node-cron');

cron.schedule('0 */6 * * *', async function() {
    try{
        const user = await users.find({role: { $ne: "CUSTOMER"}, active: true});
        const array = Object.values(JSON.parse(JSON.stringify(user)));
        var date = dateTime()[0];
        var day = dateTime()[2];
        for(var i = 0;i < array.length; i++){
            var userCode = array[i].userCode;
            var name = array[i].firstName;
            const check = await attendance.findOne({date: date, userCode: userCode});
            if(!check){
                if(array[i].middleName){
                    name = name + " " + array[i].middleName;
                }
                if(array[i].lastName){
                    name = name + " " + array[i].lastName;
                }
                const entry = await attendance.create({
                    name, userCode , date, day,
                })
            }
        }
        console.log("All users added in the attendance list");
    }catch(error){
        console.log(error);
    }    
});


module.exports.addEmployes = async (req, res) => {
    try{
        const user = await users.find({role: { $ne: "CUSTOMER"}, active: true});
        const array = Object.values(JSON.parse(JSON.stringify(user)));
        var date = dateTime()[0];
        var day = dateTime()[2];
        for(var i = 0;i < array.length; i++){
            var userCode = array[i].userCode;
            var name = array[i].firstName;
            const check = await attendance.findOne({date: date, userCode: userCode});
            if(!check){
                if(array[i].middleName){
                    name = name + " " + array[i].middleName;
                }
                if(array[i].lastName){
                    name = name + " " + array[i].lastName;
                }
                const entry = await attendance.create({
                    name, userCode , date, day,
                })
            }
        }
        res.status(200).send({success: "true", message: `All users added in the attendance list`});
    }catch(error){
        console.log(error);
        res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.markAttendance = async(req, res) => {

    const location = await geolocation.location({ip: req.body.ip});
    //req.headers.host
    const date = dateTime()[0];
    const time = dateTime()[1];
    try{
        const user = await attendance.findOne({userCode: req.body.userCode, date: date});

        if(user){
            if(user.startTime == null){
                const doc = await attendance.findOneAndUpdate(
                    {userCode: req.body.userCode, date: date }, 
                    {startTime: time,
                    latitude: location.body.latitude, 
                    longitude: location.body.longitude, 
                    attendance_status: 1},
                    {new: true}
                );
                res.status(200).send({success: "true", message: `Mark the user Present`});
            }else{
                res.status(500).send({success: "false", message: `You had already mark the attendance.`})
            }
        }else{
            res.status(500).send({success: "false", message: `User doesn't exist`})
        }
    }catch(error){
        console.log(error);
        res.status(400).send({success: "false", error:`${error}`})
    }
}

module.exports.endDay = async(req, res) => {

    try{
        const date = dateTime()[0];
        const time = dateTime()[1];
        const user = await attendance.findOne({userCode: req.body.userCode, date: date})
        if(user){
            if(user.startTime){
                const doc = await attendance.findOneAndUpdate(
                    {userCode: req.body.userCode, date: date }, 
                    {endTime: time},
                    {new: true}
                );
                res.status(200).send({success: "true", message: `Update the end time`});
            }else{
                res.status(400).send({success: "false", message: `You haven't started the day. So, you can't end the day!!`});
            }
        }else{
            res.status(400).send({success: "false", message: `User doesn't exist`})
        }
    }catch(error){
        console.log(error);
        res.status(400).send({success: "false", error:`${error}`})
    }
}