const mongoose = require('mongoose');

const superUserSchema = new mongoose.Schema({
    firstName:{
        type: String, 
        required: true
    },
    middleName:{
        type:String,
    },
    lastName:{
        type:String,
        required:true
    },
    emailId:{
        type:String,
        required:true,
        unique:true
    },
    contact:{
        type:String,
        required:true,
        unique:true
    },
    userCode:{
        type:String,
        // required:true,
        unique:true
    },
    role:{
        type:String,
        required:true
    },
	active:{
	  type: Boolean, 
	  default: true
  	},
});

module.exports = mongoose.model("superUser", superUserSchema, "superUsers");