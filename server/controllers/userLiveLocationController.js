const geolocation = require("../utils/geoLocation");
const dateTime = require("../utils/dateTimeFormat").dateDayTime;
const attendance = require("../models/attendance");

// get live location when admin click on track user
module.exports.updateLiveLocation = async (req, res) => {
    try{
        var currDate = dateTime()[0];
        const user = await attendance.find({ date: currDate, userCode: req.body.userCode });
        if (user[0].startTime !== null) {
            if (user[0].endTime === null) {
                const userCodes = req.body.userCode;
                var result = [];
                for(let i = 0;i < userCodes.length; i++){
                    var loc = {};
                    const location = await geolocation.location({ ip: ipAddress}); // ipAddress come fron headers of user but when in frontend??
                    loc["userCode"] = userCodes[i];
                    loc["latitude"] = location.body.latitude;
                    loc["longitutde"] = location.body.longitutde;
                    result.push(loc);
                }
                return res.status(200).json({
                    status: 'success',
                    data: result
                });
            } else {
                return res.status(404).json({ success: "failure", message: "User have ended his day." });
            }
        } else {
            return res.status(404).json({ success: "failure", message: "User is not present." });
        }
    }catch(error){
        console.log(error);
        res.status(400).json({ success: "false", error: `${error}` });
    }
}