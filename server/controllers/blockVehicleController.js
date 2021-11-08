require("dotenv").config();
const vehicle = require("../models/vehicle");

exports.vehicleBlock = (req, res)=>{
    const {fleetHuntId} = req.body;

    vehicle.findOne({fleetHuntId: fleetHuntId})
    .then((result)=>{
        const vehicle  = result;

        if(vehicle==null){
            res.status(404).json({
                message:`No Vehicle found with this UserCode`
            })
        }

        vehicle.active = false;
        vehicle.save()
        .then((result)=>{
            res.status(200).json({
                message:`Vehicle deactivated`
            })
        })
        .catch((err)=>{
            res.staus(500).json({
                error:`${err}`
            })
        })
    })
    .catch((err)=>{
        res.status(500).json({
            error:`${err}`
        })
    })
}