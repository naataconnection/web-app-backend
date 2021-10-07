const vehicleStatus = require("../utils/fleethunt");

module.exports.getAllVehicle = async (req, res) => {
    try{
        const vehicles = await vehicleStatus.fleethuntAllUser();
        res.status(200).json(vehicles.body);
    }catch(error){
        console.log(error);
        res.status(400).json({ success: "false", error: `${error}` });
    }
}

module.exports.getVehiclebyId = async (req, res) => {
    try{
        const id = req.body.vehicleId; 
        const vehicles = await vehicleStatus.fleethuntbyid(id);
        res.status(200).json(vehicles.body);
    }catch(error){
        console.log(error);
        res.status(400).json({ success: "false", error: `${error}` });
    }
}