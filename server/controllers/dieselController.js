const diesel = require("../models/dieselDetails");
const dateTime = require("../utils/dateTimeFormat").dateDayTime;
const gCloudUrl = require("../helpers/gCloud").gCloudUrl

module.exports.testAPI = async (req,res)=>{
    console.log("File API", req.file);
    console.log("Files API", req.files);
    console.log("Body", req.body);
    return res.status(200).json({message:"dummy"});
}

module.exports.create = async (req, res) => {
    try{
        var kmUrl, billUrl;
        if(req.files && req.files.length > 0){
            kmUrl = await gCloudUrl(req.files[0].path, "diesel/");
            billUrl = await gCloudUrl(req.files[1].path, "diesel/");
        }else{
            return res.status(404).json({
                message: "File doesn't exist",
            });
        }

        var { kmOfVehicle, pump, liter, totalAmount, vehicleNumber, userCode, paymentMode, remarks} = req.body;
        var date = dateTime()[0];
        totalAmount = parseInt(totalAmount);
        liter = parseInt(liter);
        var dieselRate = totalAmount/liter;
        var kmOfVehicleImg = kmUrl;
        var billImage = billUrl;
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
        return res.status(200).json({success: "true", message: newEntry});
    }catch(error){
        console.log(error);
        return res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.dieselDetail = async (req, res) => {
    try{
        const userList = await diesel.find({userCode: req.body.userCode});
        return res.status(200).json({ success: "true", data: userList });
    }catch(error){
        console.log(error);
        return res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.allDieselDetails = async (req, res) => {
    try{
        const userList = await diesel.find({});
        return res.status(200).json({ success: "true", data: userList });
    }catch(error){
        console.log(error);
        return res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.searchByDate = async (req, res) => {
    try{
        const userList = await diesel.find({date: req.body.date});
        return res.status(200).json({ success: "true", data: userList });
    }catch(error){
        console.log(error);
        return res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.searchByDateAndUserCode = async (req, res) => {
    try{
        const userList = await diesel.find({date: req.body.date, userCode: req.body.userCode});
        return res.status(200).json({ success: "true", data: userList });
    }catch(error){
        console.log(error);
        return res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.searchByVehicleNumber = async (req, res) => {
    try{
        const userList = await diesel.find({vehicleNumber: req.body.vehicleNumber});
        return res.status(200).json({ success: "true", data: userList });
    }catch(error){
        console.log(error);
        return res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.searchByModeOfPayment = async (req, res) => {
    try{
        const userList = await diesel.find({paymentMode: req.body.paymentMode});
        return res.status(200).json({ success: "true", data: userList });
    }catch(error){
        console.log(error);
        return res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.searchByPump = async (req, res) => {
    try{
        const userList = await diesel.find({pump: req.body.pump});
        return res.status(200).json({ success: "true", data: userList });
    }catch(error){
        console.log(error);
        return res.status(400).json({success: "false", error:`${error}`});
    }
}

module.exports.searchByDateRange = async (req, res) => {
    try{
        const userList = await diesel.find({date: {
            $gte: req.body.startDate,
            $lte: req.body.endDate
        }});
        return res.status(200).json({ success: "true", data: userList });
    }catch(error){
        console.log(error);
        return res.status(400).json({success: "false", error:`${error}`});
    }
}