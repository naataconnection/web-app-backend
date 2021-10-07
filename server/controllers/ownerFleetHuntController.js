const ownerFleetHunt = require("../models/ownerFleetHunt");

module.exports.create = async (req, res) => {
    try{
        await ownerFleetHunt.create({
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            ipAddress: req.headers.host,
            fleetHuntApiKey: req.body.fleetHuntApiKey
        });
        res.status(200).json({success: "true", message:`Added in the database`});
    }catch(error){
        console.log(error);
        res.status(400).send({success: "false", error:`${error}`})
    }
}

module.exports.update = async(req, res) => {
    try{
        await ownerFleetHunt.updateOne({ipAddress: req.headers.host, fleetHuntApiKey: req.body.fleetHuntApiKey});
        res.status(200).json({success: "true", message:`Updated in the database`});
    }catch(error){
        console.log(error);
        res.status(400).send({success: "false", error:`${error}`})
    }
}

module.exports.getData = async(req, res) => {
    try{
        const owner = await ownerFleetHunt.find({});
        console.log(owner);
        res.status(200).json({success: "true", data: owner});
    }catch(error){
        console.log(error);
        res.status(400).send({success: "false", error:`${error}`})
    }
}