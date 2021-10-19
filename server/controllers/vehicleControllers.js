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
    costPerDay
  });

  try{
      await vehicle.save();
  }
  catch(err){
      res.status(400).json({
          error:`${err}`
      })
  }

  res.status(200).json({
      message:`vehicle registered successfully`
  })
};
