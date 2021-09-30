require("dotenv").config();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");
const Driver = require("../models/driver");
const DeliveryBoy = require("../models/deliveryBoy");
const Manager = require("../models/manager");

// Controller to ckeck if user has registered.
exports.loginUser_checkUser = (req,res,next) => {
	const emailIdOrContact = req.body.emailIdOrContact;
	
	// Regular Expression to detect a email id.
	const emailId_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	// If user entered the email id
	if(emailIdOrContact.match(emailId_regex)){
		User.findOne({
		  emailId: emailIdOrContact,
		})
		.then((user) => {
			  if (!user) {
				return res.status(400).json({
          			message: "This email is not registered",
        		});
			  }
		      next();
		})
		.catch((err)=>{
			 return res.status(500).json({
          			message: "An error caught while finding the user",
        		});
		});
	}else{
		User.findOne({
		  contact: emailIdOrContact,
		})
		.then((user) => {
			  if (!user) {
				return res.status(400).json({
          			message: "This contact number is not registered",
        		});
			  }
		      next();
		})
		.catch((err)=>{
			  return res.status(500).json({
          			message: "An error caught while finding the user",
        		});
		});
	}
};

// Controller to verify otp and login user.
exports.loginUser_verifyOtp = (req, res,next) => {
  passport.authenticate("local", (err,user,info)=>{
    if(err){
		return res.status(400).json({
        message: info.message,
        error: `${err}`,
        });
	}
	else if(!user){
		return res.status(400).json({
		message: info.message,
		});
	}else{
		const employeeCode = user.employeeCode;
		const token = jsonwebtoken.sign({ user: employeeCode, maxAge: parseInt(process.env.MAX_AGE) }, process.env.SECRET);
		res.cookie('token', token, { httpOnly: true, maxAge: parseInt(process.env.MAX_AGE), secure: true });
		return res.status(200).json({message:info.message});
	}
  })(req, res,next);
};

// Controller to logout the user.
exports.logoutUser = (req,res,next) => {
	const token = req.cookies.token;
	if(token){
		jsonwebtoken.verify(token,process.env.SECRET,(err,code)=>{
			if(err){
			   return  res.status(400).json({message:"Invalid Token!!!Pls login with correct credentials"});
		   } else {
			  res.clearCookie('token');
			  res.clearCookie('employeeCode');
			  const message = "User with employee code "+code.user+" is logged out successfullly";
			  res.status(200).json({message:message});
		   }	
		});
	}else {
		res.status(400).json({message:"Token Not Found...Pls Login First!!!"});
	}
};

// Controller to verify the jwt tokens of user in any API.
exports.verifyUser = (req,res) => {
   const token = req.cookies.token;
	if(token){
		jsonwebtoken.verify(token,process.env.SECRET,(err,code)=>{
			if(err){
			   return  res.status(400).json({message:"Invalid Token!!!Pls login with correct credentials"});
		   } else {
			  const message = "Authorization of user with employee code "+code.user+" is verified";
			  res.status(200).json({message:message});
		   }	
		});
	}else {
		res.status(400).json({message:"Token Not Found...Pls Login First!!!"});
	}
};
