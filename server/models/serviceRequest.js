const mongoose = require("mongoose");

const ServiceRequestSchema = new mongoose.Schema({
  requestID: {
    type: Number,
    required: true,
    unique: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  isApproved: {
    type: Number,
    required: true,
    default: 0,
    // 0 -> Unapproved, 1 -> Approved, 2 -> Returned for changes.
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  frequency: {
    type: Number,
    default: 0,
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  vehicle: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vehicle",
    },
  ],
  driver: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  deliveryBoy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  status: {
    type: Number,
    default: 0,
    // 0 -> Unapproved
    // 1 -> Approved
    // 2 -> Assigned Manager
    // 3 -> Assigned Driver
    // 4 -> Assigned Delivery Boy
    // 5 -> Dispatched with Driver
    // 6 -> Delivered by Driver
    // 9 -> Dispatched with Delivery Boy
    // 10-> Delivered by Delivery Boy
  },

  // The below code won't be required as we will search in order database for service request.
  //   order: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "order",
  //     },
  //   ],

  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  remarks: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("serviceRequest", ServiceRequestSchema);
