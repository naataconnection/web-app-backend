const diesel = require("../models/dieselDetails");
const dateTime = require("../utils/dateTimeFormat").dateDayTime;

module.exports.create = async (req, res) => {
    try{

        var kmOfVehicleImg, billImage;
        if(req.files && req.files.length > 0){
            kmOfVehicleImg = await gCloudUrl(req.files[0].path, "diesel/");
            billImage = await gCloudUrl(req.files[1].path, "diesel/");
        }else{
            res.status(404).json({
                message: "File doesn't exist",
            });
        }

        const { kmOfVehicle, pump, liter, totalAmount, vehicleNumber, userCode, paymentMode, remarks} = req.body;
        var date = dateTime()[0];
        var dieselRate = totalAmount/liter;
        var kmOfVehicleImg = kmUrl[0];
        var billImage = billUrl[0];
        const newEntry = await diesel.create({
            kmOfVehicle,
            kmOfVehicleImg,
            pump, 
            date,
            liter, 
            dieselRate,
            totalAmount, 
            vehicleNumber,
            userCode, 
            paymentMode, 
            remarks,
            billImage,
        });
        res.status(200).json({success: "true", message: newEntry});
    }catch(error){
        console.log(error);
        res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.dieselDetail = async (req, res) => {
    try{
        const userList = await diesel.find({userCode: req.body.userCode});
        res.status(200).json({ success: "true", data: userList });
    }catch(error){
        console.log(error);
        res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.allDieselDetails = async (req, res) => {
    try{
        const userList = await diesel.find({});
        res.status(200).json({ success: "true", data: userList });
    }catch(error){
        console.log(error);
        res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.searchByDate = async (req, res) => {
    try{
        const userList = await diesel.find({date: req.body.date});
        res.status(200).json({ success: "true", data: userList });
    }catch(error){
        console.log(error);
        res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.searchByDateAndUserCode = async (req, res) => {
    try{
        const userList = await diesel.find({date: req.body.date, userCode: req.body.userCode});
        res.status(200).json({ success: "true", data: userList });
    }catch(error){
        console.log(error);
        res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.searchByVehicleNumber = async (req, res) => {
    try{
        const userList = await diesel.find({vehicleNumber: req.body.vehicleNumber});
        res.status(200).json({ success: "true", data: userList });
    }catch(error){
        console.log(error);
        res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.searchByModeOfPayment = async (req, res) => {
    try{
        const userList = await diesel.find({paymentMode: req.body.paymentMode});
        res.status(200).json({ success: "true", data: userList });
    }catch(error){
        console.log(error);
        res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.searchByPump = async (req, res) => {
    try{
        const userList = await diesel.find({pump: req.body.pump});
        res.status(200).json({ success: "true", data: userList });
    }catch(error){
        console.log(error);
        res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.searchByDateRange = async (req, res) => {
    try{
        const userList = await diesel.find({date: {
            $gte: req.body.startDate,
            $lte: req.body.endDate
        }});
        res.status(200).json({ success: "true", data: userList });
    }catch(error){
        console.log(error);
        res.status(400).json({success: "false", error:`${error}`});
    }
}