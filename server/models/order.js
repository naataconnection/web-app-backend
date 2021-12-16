const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  driver:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "driver"
  },
  orderCode: {
    type: String,
    required: true,
    unique: true,
  },
  deliverySheetId:{
    type: String,
    required: true
  },
  deliverySheetImage:{
    type: String,
  },
  proofDelivery:{
    type: String,
  },
  startingKM:{
    type: Number
  },
  startingKMProof:{
    type: String,
  },
  startingLocation:{
    type: new mongoose.Schema({
      longitude: {
        type: String
      },
      latitude: {
        type: String
      }
    })
  },
  endingKM: {
    type: Number
  },
  endingKMProof:{
    type: String,
  },
  totalParcels:{
    type:Number
  },
  totalWeight:{
    type: Number
  },
  driverRemarks:[{
    type: String
  }],
  invoices:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "invoice",
    }
  ],
  dispatch:{
    type: Boolean,
    default: false
  },
  deliver:{
    type:Boolean,
    default: false
  }
});

module.exports = mongoose.model("order", OrderSchema);
