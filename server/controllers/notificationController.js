const Notification = require("../models/notification");
const dateTime = require("../utils/dateTimeFormat").dateDayTime;

module.exports.create = async (req, res) => {
    try{
        var entryDate = dateTime()[0];
        const { userCode, contents, title, expiryDate } = req.body;
        var image = [];
        if(req.body.isImage == 1){
			const url = await gCloudUrl(req.files[i].path, "notification/");
			image.push(url);
		}
        const notification = await Notification.create({
            userCode, contents, image, title, entryDate, expiryDate,
        })
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