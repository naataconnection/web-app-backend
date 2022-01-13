const Vehicle = require("../models/vehicle");
const {paddingZero} = require("../helpers/paddingZeros");

exports.registerVehicle = async (req, res) => {
  var {
    vehicleType,
    vehicleMakeYear,
    vehicleModel,
    bodyType,
    registrationNumber,
    color,
    permit,
    registrationDate,
    ownerName,
    ownerAddress,
    ownerPhone,
    insuranceEndDate,
    dailyRent,
    costPerKM,
    costPerDay,
    fleetHuntId,
  } = req.body;

    var vehicleCode;
    var result = await Vehicle.countDocuments();
    vehicleCode = "NCVHL"+paddingZero(result+1, 4);


  const vehicle = new Vehicle({
    vehicleCode,
    vehicleType,
    vehicleMakeYear,
    vehicleModel,
    bodyType,
    registrationNumber,
    color,
    permit,
    registrationDate,
    ownerName,
    ownerAddress,
    ownerPhone,
    insuranceEndDate,
    dailyRent,
    costPerKM,
    costPerDay,
    fleetHuntId
  });

  try{
      await vehicle.save();
  }
  catch(err){
      return res.status(400).json({
          error:`${err}`
      })
  }

  return res.status(200).json({
      message:`vehicle registered successfully`
  })
};

module.exports.getVehicles = async (req, res) => {
  try{
    const list = await Vehicle.findOne({vehicleCode: req.body.vehicleCode});
    if(list){
      return res.status(200).json({success: "true", data: list});
    }
    return res.status(200).json({success: "true", message: "No Vehicle exists with this userCode"});
  }catch(error){
    return res.status(400).json({success: "false", error:`${error}`});
  }
}

module.exports.allVehicles = async (req, res) => {
  try{
    const list = await Vehicle.find();
    if(list[0]){
      return res.status(200).json({success: "true", data: list});
    }
    return res.status(200).json({success: "true", message: "No Vehicle exists"});
  }catch(error){
    return res.status(400).json({success: "false", error:`${error}`});
  }
}
