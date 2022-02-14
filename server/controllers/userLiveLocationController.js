const geolocation = require("../utils/geoLocation");
const dateTime = require("../utils/dateTimeFormat").dateDayTime;
const attendance = require("../models/attendance");
const User = require("../models/user") ;

// get live location when admin click on track user
module.exports.updateLiveLocation = async (req, res) => {
    try{
        var currDate = dateTime()[0];
        const userCodes = req.body.userCode;
        var result = [];
        for(let i = 0;i < userCodes.length; i++){
            const user = await attendance.findOne({ date: currDate, userCode: userCodes[i]});
            var location = {};
            location["userCode"] = userCodes[i];
            try{
                if (user.startTime !== null) {
                    if (user.endTime === null) {
                        const ipAddress = await User.findOne({userCode: userCodes[i]}.select({"ipAddress": 1}));
                        const loc = await geolocation.location({ ip: ipAddress});
                        location["status"] = "true";
                        location["latitude"] = loc.body.latitude;
                        location["longitutde"] = loc.body.longitutde;
                        // result.push(location);
                    }else {
                        location["status"] = "false";
                        location["message"] = "User have ended his day";
                    }
                }else {
                    location["status"] = "false";
                    location["message"] = "User is not present";
                }
                // result.push(location);
            }catch{
                location["status"] = "false";
                location["message"] = "Unable to track user's live location !!";
            }
            result.push(location);
        }
        return res.status(200).json({status: "true", data: result});
       
    }catch(error){
        console.log(error);
        return res.status(400).json({ success: "false", error: `${error}` });
    }
}