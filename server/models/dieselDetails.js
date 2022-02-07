const mongoose = require("mongoose");

const dieselSchema = new mongoose.Schema({
  kmOfVehicle: {
    type: String,
  },
  kmOfVehicleImg:{
    type: String, 
    required: true
  },
  pump: {
    type: String,
  },
  date:{
    type: String,
  },
  liter: {
    type: Number,
  },
  dieselRate:{
    type: Number,
  },
  totalAmount: {
    type: Number,
  },
  vehicleNumber:{
    type: String,
  },
  userCode:{
    type: String,
  },
  paymentMode:{
    type:String,
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
