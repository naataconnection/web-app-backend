require("dotenv").config();
const vehicle = require("../models/vehicle");

exports.vehicleBlock = async (req, res)=>{
    try{
        const {fleetHuntId} = req.body;
        const result = await vehicle.findOne({fleetHuntId: fleetHuntId});
        if(result == null){
            return res.status(404).json({message:`No Vehicle found with this UserCode`});
        }
        result.active = false;
        await result.save();
        return res.status(200).json({message:`Vehicle deactivated`});
    }catch(error){
        console.log(error);
        return res.staus(500).json({error:`${error}`});
    }
}