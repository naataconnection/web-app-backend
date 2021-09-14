require("dotenv").config();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const mailer = require("../helpers/mailer");
const User = require("../models/user");
const mongoose = require("mongoose");
const session = require("express-session");
const jsonwebtoken = require("jsonwebtoken");
const express_jwt=require("express-jwt");
const cookie_parser=require("cookie-parser");

const otp = require("../helpers/otp");
const OTP = require("../models/otp");

const validator = require('validator');
const { query } = require("express");

const url = require('url');

exports.responseEmail = (req, res) => {
  const receiverEmail = req.body.receiverEmail;

  console.log(req.body);

  mailer
    .send(
      `${process.env.EMAIL_SMTP_USERNAME}`,
      receiverEmail,
      "Test Mail",
      `<h1>This is Test Mail</h1>`
    )
    .then((result) => {
      res
      .status(200)
      .json({
          message: `Verification Mail Sent`
      })
    })
    .catch((err) => {
      res
      .status(500)
      .json({
          message: `Error in NodeMailer API`,
          error : `${err}`
      })
    });
  res.send("Email Sent");
};

exports.registerUser = (req, res) => {
var { firstName, middleName, lastName, password, emailId, contact, employeeCode} = req.body;

  if (!firstName || !emailId || !password || !employeeCode) {
    res.status(409).json({
      message: "Required fields are not present.",
    });
  }

  employeeCode = employeeCode.toUpperCase();
//   console.log(`CC is ${companyCode} and ${companyCode.slice(0,1)}`)

employeeCode = employeeCode.toUpperCase();
//   console.log(`CC is ${companyCode} and ${companyCode.slice(0,1)}`)

  if(employeeCode.slice(0,2)!="NC"){
    res.status(500).json({
        message: "Invalid Employee Code"
    })
  }

  User.find({ emailId: emailId })
    .then((result) => {
      console.log(result.length);

      if (result.length != 0) {
        return res.status(409).json({
          message: `Email already exits.`,
        });
      } else {
        const user = new User({
          firstName,
          middleName,
          lastName,
          password,
          emailId,
          contact,
          employeeCode
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: `${err}`,
            });
          }
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                message: `${err}`,
              });
            }
            user.password = hash;
            user
              .save()
              .then((result) => {
                return res.status(200).json({
                  message: `User Registraion Successful`,
                });
              })
             .catch((err) => {
                res.status(500).json({
                  message: `Incorrect Data Provided`,
                  error: `${err}`,
                });
              });
          });
        });

        console.log(user);
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: `No User found with this emailId`,
        error: `${err}`,
      });
    });
};


exports.loginUser = (req, res, next) => {
  passport.authenticate("local", (err,user,info)=>{
    if(err){
		console.log(info.message);
		return res.status(500).json({
        message: info.message,
        error: `${err}`,
        });
	}
	else if(!user){
		return res.status(500).json({
		message: info.message,
		});
	}else{
		const employeeCode = user.employeeCode;
		const token = jsonwebtoken.sign({ user: employeeCode, maxAge: parseInt(process.env.MAX_AGE) }, process.env.SECRET);
		res.cookie('token', token, { httpOnly: true, maxAge: parseInt(process.env.MAX_AGE), secure: true });
		res.cookie('employeeCode',employeeCode, { httpOnly: true, maxAge: parseInt(process.env.MAX_AGE), secure: true });
		return res.status(200).json({message:info.message});
	}
  })(req, res, next);
};

exports.logoutUser = (req,res,next) => {
	if(req.cookies){
	   if( req.cookies.username){
		const username = req.cookies.username;
	    res.clearCookie('username');	
		res.status(200).json({username:username, message:"User logged out sucessfully"});
	   }	
	}else {
		res.status(500).json({message:"Token not found!!"});
	}
};

exports.verifyJWT = (req,res) => {
   const token = req.cookie.token;
   if(!token){
	   return res.status(400).json({message:"Token Not Found...Pls Login First!!!"});
   }else{
	   jwt.verify(token, process.env.SECRET, (err,decoded)=>{
		   if(err){
			   return  res.status(400).json({message:"Invalid Token!!!Pls login with correct credentials"});
		   } else {
			   res.cookie('employeeCode',decoded);
			   return res.status(200).json({message:"Done",username:decoded});
			   // replace res.send with next() when used in other APIs;
		   }
	   })
   }
};

// controller to generate new otp for particular user
exports.generateOTP = (req, res) => {
    const contact = req.body.contact;

    User.findOne({contact: contact}, (err, user) => {
        if (err) {
        res.status(404).json({
            message: "Unable to generate OTP for required user.",
        });
        } else {
        const newOTP = new OTP({
            otp: otp(),
            user,
        });
        console.log(newOTP);
        newOTP
            .save()
            .then((data) =>
            res.status(200).json({
                otp: data.otp,
                message: "OTP generated.",
            })
            )
            .catch((err) =>
            res.status(500).json({
                message: "Error saving new OTP",
                err: `${err}`,
            })
            );
        }
    });
};

exports.showOTP = (req, res) => {
  OTP.find({}, (err, list) => {
    if (err) {
      res.status(500).json({
        message: "unable to get all otps from database",
        error: `${err}`,
      });
    } else {
      res.send(list);
    }
  });
};

exports.generateOTPnoUser = (req, res) => {
    const newOTP = new OTP({
        otp: otp(),
    });
    console.log(newOTP);
    newOTP.save((err) => {
        if (err) {
        res.status(500).json({
            message: "Error saving new OTP",
            err: `${err}`,
        });
        } else {
        res.status(200).json({
            message: "OTP generated successfully",
            otp: newOTP.otp,
        });
        }
    });
};

exports.sendVerificationEmail = (req, res) => {
    const emailId = req.body.emailId;

    console.log(`${emailId} is the emailid from body`)

    User.findOne({emailId: emailId})
    .then((result) =>{
        const user = result;

        if(user.verified==true){
            res
            .status(200)
            .json({
                message: `User already verified`
            })
        }

        const randm = otp();

        const newOTP = new OTP({
            otp: randm,
            user
        });

        newOTP.save();

        const host = req.get('host');
        const link = req.protocol + '://' + host + "/email/verify?emailId=" + emailId + "&OTP=" + randm;

        mailer
        .send(
          `${process.env.EMAIL_SMTP_USERNAME}`,
          emailId,
          "Verification Mail",
          `Hello,<br> Please Click on the link to verify your email.<br><a href="${link}">Click here to verify</a>`
        )
        .then((result) => {
          res
          .status(200)
          .json({
              message: `Verification Mail Sent`
          })
        })
        .catch((err) => {
          res
          .status(500)
          .json({
              message: `Error in NodeMailer API`,
              error : `${err}`
          })
        });
    })
    .catch((err) => {
        res
        .status(404)
        .json({
            message : 'No User found with this emailId',
            error: `${err}`
        })
    });
};


exports.verifyVerificationEmail = (req, res) => {
    const url_parts = url.parse(req.url, true);
    console.log(`${url_parts} = url parts`)

    const emailId = url_parts.query.emailId;
    const otpFromUrl = url_parts.query.OTP;

    console.log(`${emailId}`);

    User.findOne({emailId: emailId})
    .then((result) =>{
        const user = result;
        console.log()
        OTP.findOne({user}).sort({_id:-1}).limit(1)
        .then((result) => {
            const otpFromDatabase = result.otp;

            if(otpFromDatabase==otpFromUrl){
                user.emailVerified = true;
                user.save();

                res
                .status(200)
                .json({
                    message: `Email Verification Successful`
                })
            }
            else{
                res
                .status(400)
                .json({
                    message: `Wrong OTP`
                })
            }
        })
        .catch((err) => {
            res
            .status(400)
            .json({
                message: `No OTP found for User`
            })
        });
    })
    .catch((err) => {
        res
        .status(404)
        .json({
            message : 'No User found with this emailId',
            error: `${err}`
        })
    });
};