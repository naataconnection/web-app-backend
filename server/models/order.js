const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderCode: {
    type: String,
    required: true,
    unique: true,
  },
  serviceRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "serviceRequest",
  },
  totalParcels:{
    type:Number,
    required:true
  },
  invoices:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "invoice",
    }
  ]
});

module.exports = mongoose.model("order", OrderSchema);