const userStat = require("../models/userStat");
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
                const result = await userStat.find({userCode: req.body.userCode});
                const location = await geolocation.location({ ip: result[0].ipAddress});
                const doc = await userStat.findOneAndUpdate(
                    {userCode: req.body.userCode}, 
                    {currLatitude: location.body.latitude, 
                     currLongitude: location.body.longitude},
                    {new: true}
                );
                
                return res.status(200).json({
                    status: 'success',
                    data: {
                        latitude: doc.currLatitude,
                        longitude: doc.currLongitude,
                    }
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