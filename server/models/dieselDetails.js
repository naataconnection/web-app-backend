const mongoose = require("mongoose");

const dieselSchema = new mongoose.Schema({
  kmOfVehicle: {
    type: String,
    required: true,
  },
  kmOfVehicleImg:{
    type: String, 
    required: true,
  },
  pump: {
    type: String,
    required:true,
  },
  date:{
    type: String,
  },
  liter: {
    type: Number,
    required: true
  },
  dieselRate:{
    type: Number,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
//   vehicleId:{
//     type: String,
//     required: true,
//   },
  userCode:{
    type: String,
    required: true,
  },
  paymentMode:{
    type:String,
    required: true
  },
  remarks:{
	  type: String, 
      default: null
  },
  billImage:{
      type: String,
      required: true
  }
});

module.exports = mongoose.model("dieselDetails", dieselSchema);
