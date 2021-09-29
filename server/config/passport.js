const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const otp = require("../helpers/otp");
const OTP = require("../models/otp");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: "emailId" },
					  (emailId, otp_enetered, done) => {
														// Match User
														User.findOne({
														  emailId: emailId,
														})
														.then((user) => {
															  if (!user) {
																return done(null, false, {
																  message: "The email is not registered",
																});
															  }
															    
															    // Match OTP
															    OTP.findOne({user: user})
															    .then((otp)=>{
																	if(!otp){
																		return done(null, false, {
																  			message: "OTP is expired !! Please start from email id again !!",
																		});
																	}
																	// console.log(otp.otp);
																	// console.log(otp_enetered);
																	if(otp.otp==otp_enetered){
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
