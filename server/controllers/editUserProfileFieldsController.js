require("dotenv").config();
const passport = require("passport");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");
const Otp = require("../models/otp");

// Controller to update email id.
exports.updateEmailIdOrContact = async (req,res,next) => {
	const emailIdOrContact = req.body.emailIdOrContact;
	const userCode = req.cookies.userCode;
	
	// Regular Expression to detect a email id.
	const emailId_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	// If user entered the email id
	if(emailIdOrContact.match(emailId_regex)){
		try{
			const user = await User.findOne({userCode: userCode});
			user.emailId = emailIdOrContact;
			await user.save();
			return res.status(200).json({message: "EmailId successfully updated"});
		}catch(error){
			return res.status(500).json({message: "An error caught while finding the user"});
		}
	}else{
		try{
			const user = await User.findOne({contact: emailIdOrContact});
			user.contact = emailIdOrContact;
			await user.save();
			return res.status(200).json({message: "Contact number successfully updated"});
		}catch(error){
			return res.status(500).json({message: "An error caught while finding the user"});
		}
	}
};
