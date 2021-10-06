require("dotenv").config();
const passport = require("passport");
const jsonwebtoken = require("jsonwebtoken");
const SuperUser = require("../models/superUser");

// Controller to check if super user has registered.
exports.loginSuperUser_checkSuperUser = (req,res,next) => {
	const emailIdOrContact = req.body.emailIdOrContact;
	
	// Regular Expression to detect a email id.
	const emailId_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	// If super user entered the email id
	if(emailIdOrContact.match(emailId_regex)){
		SuperUser.findOne({
		  emailId: emailIdOrContact,
		})
		.then((superUser) => {
			  if (!superUser) {
				return res.status(400).json({
          			message: "This email is not registered",
        		});
			  }
			  if(!superUser.active) {
				return res.status(400).json({
          			message: "This super user is blocked.",
        		});
			  }
		      next();
		})
		.catch((err)=>{
			 return res.status(500).json({
          			message: "An error caught while finding the super user",
        		});
		});
	}else{
		SuperUser.findOne({
		  contact: emailIdOrContact,
		})
		.then((superUser) => {
			  if (!superUser) {
				return res.status(400).json({
          			message: "This contact number is not registered",
        		});
			  }
			 if(!superUser.active) {
				return res.status(400).json({
          			message: "This super user is blocked.",
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

// Controller to verify otp and login super user.
exports.loginSuperUser_verifyOtp = (req, res,next) => {
  passport.authenticate("superUser-local", (err,superUser,info)=>{
    if(err){
		return res.status(400).json({
        message: info.message,
        error: `${err}`,
        });
	}
	else if(!superUser){
		return res.status(400).json({
		message: info.message,
		});
	}else{
		const userCode = superUser.userCode;
		const token = jsonwebtoken.sign({ user: userCode, maxAge: parseInt(process.env.MAX_AGE) }, process.env.SECRET);
		res.cookie('token', token, { httpOnly: true, maxAge: parseInt(process.env.MAX_AGE), secure: true });
		return res.status(200).json({message:info.message});
	}
  })(req, res,next);
};

// Controller to logout the super user.
exports.logoutSuperUser = (req,res,next) => {
	const token = req.cookies.token;
	if(token){
		jsonwebtoken.verify(token,process.env.SECRET,(err,code)=>{
			if(err){
			   return  res.status(400).json({message:"Invalid Token!!!Pls login with correct credentials"});
		   } else {
			  res.clearCookie('token');
			  // res.clearCookie('userCode');
			  const message = "Super User with user code "+code.user+" is logged out successfullly";
			  res.status(200).json({message:message});
		   }	
		});
	}else {
		res.status(400).json({message:"Token Not Found...Pls Login First!!!"});
	}
};
