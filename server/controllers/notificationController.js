const Notification = require("../models/notification");
const dateTime = require("../utils/dateTimeFormat").dateDayTime;

module.exports.create = (req, res) => {
    try{
        var entryDate = dateTime()[0];
        const notification = await Notification.create({
            userCode, contents, image, title, entryDate, expiryDate,
        })
        res.status(200).send({success: "true", message: `Notification added in the database`});
    }catch(error){
        console.log(error);
        res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.getNotification = (req, res) => {
    try{
        const currDate = dateTime()[0];
        const result = await Notification.find({
            expiryDate: {
                $gt: currDate,
            },
        })
        res.status(200).send({success: "true", message: `${result}`});
    }catch(error){
        console.log(error);
        res.status(400).json({success: "false", error:`${error}`});
    }
}