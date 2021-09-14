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
  employeeCode:{
    type: String,
    required: true,
	unique: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  contactVerified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("user", userSchema, "users");
