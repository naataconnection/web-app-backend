const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");
const SuperUser = require("../models/superUser");
const otp = require("../helpers/otp");
const OTP = require("../models/otp");

module.exports = (passport) => {
  passport.use('user-local',
    new LocalStrategy({ usernameField: "emailIdOrContact" },
					  (emailIdOrContact, otp_enetered, done) => {
														// Regular Expression to detect a email id.
														const emailId_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
														// If user entered the email id
														if(emailIdOrContact.match(emailId_regex)){
															User.findOne({
															  emailId: emailIdOrContact,
															})
															.then((user) => {
																  if (!user) {
																	return done(null, false, {
																	  message: "This user is not registered",
																	});
																  }

																	// Find the latest created otp for the user.
																	OTP.find({user: user}).sort({"createdAt": -1}) 
																	.then((otp)=>{
																		if(!otp){
																			return done(null, false, {
																				message: "OTP is expired !! Please start from email id again !!",
																			});
																		}
																		if(otp[0].otp==otp_enetered){
																			return done(null, user,{message:"Login Sucessfully Done"});
																		}
																		else{
																			return done(null, false, {
																				message: "Incorrect Otp Entered",
																			 });
																		}
																	})
																	.catch((err)=>{
																		return done(err,{message:"Error Caught"});
																	});

															})
															.catch((err)=>{
																 return done(err,{message:"Error Caught"});
															});
														}else{
															User.findOne({
															  contact: emailIdOrContact,
															})
															.then((user) => {
																  if (!user) {
																	return done(null, false, {
																	  message: "This user is not registered",
																	});
																  }

																	// Find the latest created otp for the user.
																	OTP.find({user: user}).sort({"createdAt": -1}) 
																	.then((otp)=>{
																		if(!otp){
																			return done(null, false, {
																				message: "OTP is expired !! Please start from email id again !!",
																			});
																		}
																		console.log(otp[0].otp);
																		// console.log(otp_enetered);
																		if(otp[0].otp==otp_enetered){
																			return done(null, user,{message:"Login Sucessfully Done"});
																		}
																		else{
																			return done(null, false, {
																				message: "Incorrect Otp Entered",
																			 });
																		}
																	})
																	.catch((err)=>{
																		return done(err,{message:"Error Caught"});
																	});

															})
															.catch((err)=>{
																 return done(err,{message:"Error Caught"});
															});
														}
													}
	                     ) 
             )
	
	
  passport.use('superUser-local',
    new LocalStrategy({ usernameField: "emailIdOrContact" },
					  (emailIdOrContact, otp_enetered, done) => {
														// Regular Expression to detect a email id.
														const emailId_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
														// If user entered the email id
														if(emailIdOrContact.match(emailId_regex)){
															SuperUser.findOne({
															  emailId: emailIdOrContact,
															})
															.then((superUser) => {
																  if (!superUser) {
																	return done(null, false, {
																	  message: "This super user is not registered",
																	});
																  }

																	// Find the latest created otp for the super user.
																	OTP.find({superUser:superUser}).sort({"createdAt": -1}) 
																	.then((otp)=>{
																		if(!otp){
																			return done(null, false, {
																				message: "OTP is expired !! Please start from email id again !!",
																			});
																		}
																		if(otp[0].otp==otp_enetered){
																			return done(null, superUser,{message:"Login Sucessfully Done"});
																		}
																		else{
																			return done(null, false, {
																				message: "Incorrect Otp Entered",
																			 });
																		}
																	})
																	.catch((err)=>{
																		return done(err,{message:"Error Caught"});
																	});

															})
															.catch((err)=>{
																 return done(err,{message:"Error Caught"});
															});
														}else{
															SuperUser.findOne({
															  contact: emailIdOrContact,
															})
															.then((superUser) => {
																  if (!superUser) {
																	return done(null, false, {
																	  message: "This super user is not registered",
																	});
																  }

																	// Find the latest created otp for the super user.
																	OTP.find({superUser:superUser}).sort({"createdAt": -1}) 
																	.then((otp)=>{
																		if(!otp){
																			return done(null, false, {
																				message: "OTP is expired !! Please start from email id again !!",
																			});
																		}
																		console.log(otp[0].otp);
																		// console.log(otp_enetered);
																		if(otp[0].otp==otp_enetered){
																			return done(null, superUser,{message:"Login Sucessfully Done"});
																		}
																		else{
																			return done(null, false, {
																				message: "Incorrect Otp Entered",
																			 });
																		}
																	})
																	.catch((err)=>{
																		return done(err,{message:"Error Caught"});
																	});

															})
															.catch((err)=>{
																 return done(err,{message:"Error Caught"});
															});
														}
													}
	                     ) 
             )

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
