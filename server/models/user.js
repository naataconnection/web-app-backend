const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
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
    required: true,
  },
});

module.exports = mongoose.model("user", userSchema, "users");

// Employee: Driver, Delivery, Manager, etc.
// Company Employee Category Code: distinguish category of employees
// Match employee code with company code for safety.
