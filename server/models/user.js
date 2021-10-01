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
  // password: {
  //   type: String,
  //   required: true,
  // },
  emailId: {
    type: String,
    unique: true
  },
  contact:{
    type: String,
    unique: true
  },
  userCode:{
    type: String,
    // required: true,
	  unique: true
  },
  role:{
    type:String,
    required: true
  },
  active:{
<<<<<<< Updated upstream
	  type: Boolean, 
	  default: true
  },
=======
    type: Boolean,
    default:true
  }
>>>>>>> Stashed changes
});

module.exports = mongoose.model("user", userSchema, "users");
