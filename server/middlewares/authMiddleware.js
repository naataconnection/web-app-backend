require("dotenv").config();
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

exports.authRequired = (req, res, next) => {
	if (req.isAuthenticated()) {
	  return next();
	}
	res.redirect("/");
};

exports.forwardAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) {
	  return next();
	}
	res.redirect("/");
};

// Controller to verify the jwt tokens of user in any API.
exports.verifyUser = (req,res,next) => {
   const token = req.cookies.token;
	if(token){
		jsonwebtoken.verify(token,process.env.SECRET,(err,code)=>{
			if(err){
			   return  res.status(400).json({message:"Invalid Token!!!Pls login with correct credentials"});
		   } else {
			  // const message = "Authorization of user with employee code "+code.user+" is verified";
			  // res.status(200).json({message:message});
			  return next();
		   }	
		});
	}else {
		res.status(400).json({message:"Token Not Found...Pls Login First!!!"});
	}
};

