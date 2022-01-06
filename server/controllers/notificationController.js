const Notification = require("../models/notification");
const dateTime = require("../utils/dateTimeFormat").dateDayTime;
const gCloudUrl = require("../helpers/gCloud").gCloudUrl;

module.exports.create = async (req, res) => {
    try{
        var entryDate = dateTime()[0];
        const { userCode, content, title, expiryDate } = req.body;
        var img = [];
        if(req.body.isImage == 1){
            for(let i = 0;i < req.files.length; i++){
                const url = await gCloudUrl(req.files[i].path, "notification/");
                img.push(url);
            }
		}
        const image = img;
        const notification = await Notification.create({
            userCode, content, image, title, entryDate, expiryDate,
        });
        res.status(200).send({success: "true", message: `Notification added in the database`});
    }catch(error){
        console.log(error);
        res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.getNotification = async (req, res) => {
    try{
        const currDate = dateTime()[0];
        const result = await Notification.find({
            expiryDate: {
                $gt: currDate,
            },
        })
        res.status(200).send({success: "true", message: result});
    }catch(error){
        console.log(error);
        res.status(400).json({success: "false", error:`${error}`});
    }
}