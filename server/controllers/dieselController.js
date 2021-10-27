const diesel = require("../models/dieselDetails");
const dateTime = require("../utils/dateTimeFormat").dateDayTime;
const uploadFile = require("../utils/gCloud").uploadFile;
const fs = require('fs');

module.exports.create = async (req, res) => {
    try{
        const kmOfVehiclePath = req.files[0].path.replace('\\', '/');
        const localdestkmOfVehicle = __dirname + "/../../public/profile/" + kmOfVehiclePath.substring(kmOfVehiclePath.lastIndexOf('\\') + 1);
        const kmOfVehicledestPath = "diesel/" + kmOfVehiclePath.substring(kmOfVehiclePath.lastIndexOf('\\') + 1);
        let kmUrl = uploadFile(localdestkmOfVehicle, kmOfVehicledestPath);
        kmUrl = await Promise.all([kmUrl]);
        fs.unlinkSync(localdestkmOfVehicle);

        const billPath = req.files[1].path.replace('\\', '/');
        const localdestBill = __dirname + "/../../public/profile/" + billPath.substring(billPath.lastIndexOf('\\') + 1);
        const billdestPath = "diesel/" + billPath.substring(billPath.lastIndexOf('\\') + 1);
        let billUrl = uploadFile(localdestBill, billdestPath);
        billUrl = await Promise.all([billUrl]);
        fs.unlinkSync(localdestBill);

        const { kmOfVehicle, pump, liter, totalAmount, userCode, paymentMode, remarks} = req.body;
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