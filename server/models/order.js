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
  // deliverySheetImage:{
  //   type: String,
  //   required: true
  // },
  // proofDelivery:{
  //   type: File,
  //   required: true
  // },
  startingKM:{
    type: Number,
    required: true
  },
  // startingKMProof:{
  //   type: File,
  //   required:true,
  // },
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
    type: Number,
    required:true
  },
  // endingKMProof:{
  //   type: File,
  //   required:true,
  // },
  totalParcels:{
    type:Number,
    required: true
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
