const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName:{
    type: String, 
    required:false,
  },
  lastName: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    unique: true
  },
  contact:{
    type: String,
    unique: true
  },
  companyCode:{
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("user", userSchema, "users");

// Employee: Driver, Delivery, Manager, etc.
// Company Employee Category Code: distinguish category of employees
// Match employee code with company code for safety.
