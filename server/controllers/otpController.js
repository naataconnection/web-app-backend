require("dotenv").config();
const User = require("../models/user");
const SuperUser = require("../models/superUser");
const otp = require("../helpers/otp");
const OTP = require("../models/otp");
const mailer = require("../helpers/mailer");
const sms = require("../helpers/sms");
const { otpFormat, smsFormat } = require("../helpers/mailFormat");

// Controller to generate a new OTP for a particular user.
exports.generateOTP = async (req, res) => {
    try{
        const contact = req.body.contact;
        const user = await User.findOne({contact: contact}); 
        const newOTP = new OTP({otp: otp(), user: user});
        console.log(newOTP);
        const data = await newOTP.save();
        return res.status(200).json({otp: data.otp, message: "OTP generated."});
    }catch(error){
        return res.status(404).json({error: `${error}`});
    } 
};

// Controller to generate and send the generated otp to the new email ID or contact in the request.
exports.generateAndSendOTPForUser_ToNewEmailIdOrContact = async (req, res) => {
	const userCode = req.cookies.userCode;
	const emailIdOrContact = req.body.emailIdOrContact;
	
	// Regular Expression to detect a email id.
	const emailId_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
	// If user entered the email id
	if(emailIdOrContact.match(emailId_regex)){
        try{
            const user = await User.findOne({userCode: userCode});
            if(user){
                const newOTP = new OTP({otp: otp(), user: user});
                const data = await newOTP.save();
                var name = user.firstName;
                if(user.middleName){
                    name += " " + user.middleName;
                }
                if(user.lastName){
                    name += " " + user.lastName;
                }
                const [subject, body] = otpFormat(name, newOTP.otp);
                await mailer.send(
                    `${process.env.EMAIL_SMTP_USERNAME}`, emailIdOrContact, subject, body
                );
                return res.status(200).json({message: `OTP generated and sent to the entered email ID.`});
            }   
            return res.status(404).json({message: "User doesn't exist"});
        }catch(error){
            return res.status(404).json({error: `${error}`});
        }
	}else{
        try{
            const user = await User.findOne({userCode: userCode});
            if(user){
                const newOTP = new OTP({otp: otp(), user: user});
                const data = await newOTP.save();
                var name = user.firstName;
                if(user.middleName){
                    name += " " + user.middleName;
                }
                if(user.lastName){
                    name += " " + user.lastName;
                }
                const message = smsFormat(name, newOTP.otp);
                await sms.sendOtp(message, emailIdOrContact);
                return res.status(200).json({message: `OTP generated and sent to the entered email ID.`});
            }   
            return res.status(404).json({message: "User doesn't exist"});
        }catch(error){
            return res.status(404).json({error: `${error}`});
        }
	}
    return;
};

// Controller to generate a new OTP for a particular user and send it to the email id or contact number.
exports.generateAndSendOTPForUser = async (req, res) => {
    const emailIdOrContact = req.body.emailIdOrContact;
	
	// Regular Expression to detect a email id.
	const emailId_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
	// If user entered the email id
	if(emailIdOrContact.match(emailId_regex)){
        try{
            const user = await User.findOne({emailId: emailIdOrContact});
            if(user){
                const newOTP = new OTP({otp: otp(), user: user});
                const data = await newOTP.save();
                var name = user.firstName;
                if(user.middleName){
                    name += " " + user.middleName;
                }
                if(user.lastName){
                    name += " " + user.lastName;
                }
                const [subject, body] = otpFormat(name, newOTP.otp);
                await mailer.send(
                    `${process.env.EMAIL_SMTP_USERNAME}`, emailIdOrContact, subject, body
                );
                return res.status(200).json({message: `OTP generated and sent to the entered email ID.`});
            }   
            return res.status(404).json({message: "Unable to generate OTP for required user.",});
        }catch(error){
            return res.status(404).json({error: `${error}`});
        }
	}else{
        try{
            const user = await User.findOne({contact: emailIdOrContact});
            if(user){
                const newOTP = new OTP({otp: otp(), user: user});
                const data = await newOTP.save();
                var name = user.firstName;
                if(user.middleName){
                    name += " " + user.middleName;
                }
                if(user.lastName){
                    name += " " + user.lastName;
                }
                const message = smsFormat(newOTP.otp);
                await sms.sendOtp(message, emailIdOrContact);
                return res.status(200).json({message: `OTP generated and sent to the entered mobile number.`});
            }   
            return res.status(404).json({message: "User doesn't exist"});
        }catch(error){
            return res.status(404).json({error: `${error}`});
        }
	}
};

// Controller to generate a new OTP for a particular super user and send it to the email id or contact number.
exports.generateAndSendOTPForSuperUser = async (req, res) => {
    const emailIdOrContact = req.body.emailIdOrContact;
	
	// Regular Expression to detect a email id.
	const emailId_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
	// If super user entered the email id
	if(emailIdOrContact.match(emailId_regex)){
        try{
            const superUser = await SuperUser.findOne({emailId: emailIdOrContact});
            if(superUser){
                const newOTP = new OTP({otp: otp(), superUser: superUser});
                const data = await newOTP.save();
                var name = superUser.firstName;
                if(superUser.middleName){
                    name += " " + superUser.middleName;
                }
                if(superUser.lastName){
                    name += " " + superUser.lastName;
                }
                const [subject, body] = otpFormat(name, newOTP.otp);
                await mailer.send(
                    `${process.env.EMAIL_SMTP_USERNAME}`,emailIdOrContact, subject, body
                );
                return res.status(200).json({message: `OTP generated and sent to the entered email ID.`});
            }   
            return res.status(404).json({message: "Unable to generate OTP for required super user.",});
        }catch(error){
            return res.status(404).json({error: `${error}`});
        }
	}else{
        try{
            const superUser = await SuperUser.findOne({contact: emailIdOrContact});
            if(superUser){
                const newOTP = new OTP({otp: otp(), superUser: superUser});
                const data = await newOTP.save();
                var name = superUser.firstName;
                if(superUser.middleName){
                    name += " " + superUser.middleName;
                }
                if(superUser.lastName){
                    name += " " + superUser.lastName;
                }
                const message = smsFormat(newOTP.otp);
                await sms.sendOtp(message, emailIdOrContact);
                return res.status(200).json({message: `OTP generated and sent to the entered mobile number.`});
            }   
            return res.status(404).json({message: "Super user doesn't exist"});
        }catch(error){
            return res.status(404).json({error: `${error}`});
        }
	}
};

// Controller to fetch otp list and send it in response.
exports.showOTP = async (req, res) => {
  try{
    const otp = await OTP.find({});
    res.send(otp);
  }catch(error){
    return res.status(500).json({message: "unable to get all otps from database",error: `${err}`});
  }  
};

// Controller to generate a new OTP.
exports.generateOTPnoUser = async (req, res) => {
    try{
        const newOTP = new OTP({otp: otp()});
        console.log(newOTP);
        await newOTP.save();
        return res.status(200).json({message: "OTP generated successfully", otp: newOTP.otp});
    }catch(error){
        return  res.status(500).json({message: "Error saving new OTP", err: `${err}`});
    }
};

// Controller to ckeck the otp entered by the user.
exports.verifyOtp = async (req,res,next) => {
    try{
        const otp_entered = req.body.otp;
	    const userCode = req.cookies.userCode;
        const user = await User.findOne({userCode:userCode});
        if(user){
            const otp = await OTP.find({user: user}).sort({"createdAt": -1});
            if(!otp){
                return res.status(400).json({message: "OTP is expired !! Please start from email id again !!",});
            }
            if(otp[0].otp==otp_entered){
                return next();
            }
            else{
                return res.status(400).json({message: "Incorrect Otp Entered",});
            }
        }
        return res.status(500).json({message: "An error caught while finding the user",})
    }catch(error){
        return res.status(500).json({message: `${error}`});
    }
	
};