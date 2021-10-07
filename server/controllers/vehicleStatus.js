const vehicleStatus = require("../utils/fleethunt");
const ownerFleetHunt = require("../models/ownerFleetHunt");
const driver = require("../models/driver");

module.exports.getAllVehicle = async (req, res) => {
    try{
        const owner = await ownerFleetHunt.find({});
        const vehicles = await vehicleStatus.fleethuntAllUser(owner[0].fleetHuntApiKey);
        res.status(200).json(vehicles.body);
    }catch(error){
        console.log(error);
        res.status(400).json({ success: "false", error: `${error}` });
    }
}

module.exports.getVehiclebyId = async (req, res) => {
    try{
        const owner = await ownerFleetHunt.find({});
        const vehicles = await vehicleStatus.fleethuntbyid(req.body.fleetHuntId, owner[0].fleetHuntApiKey);
        res.status(200).json(vehicles.body);
    }catch(error){
        console.log(error);
        res.status(400).json({ success: "false", error: `${error}` });
    }
}