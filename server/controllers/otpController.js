require("dotenv").config();
const User = require("../models/user");
const otp = require("../helpers/otp");
const OTP = require("../models/otp");
const mailer = require("../helpers/mailer");
const sms = require("../helpers/sms");

// Controller to generate a new OTP for a particular user.
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

// Controller to generate a new OTP for a particular user and send it to the email id or contact number.
exports.generateAndSendOTP = (req, res) => {
    const emailIdOrContact = req.body.emailIdOrContact;
	
	// Regular Expression to detect a email id.
	const emailId_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
	// If user entered the email id
	if(emailIdOrContact.match(emailId_regex)){
		User.findOne({emailId: emailIdOrContact}, (err, user) => {
        if (err) {
        res.status(404).json({
            message: "Unable to generate OTP for required user.",
        });
        } else {
        const newOTP = new OTP({
            otp: otp(),
            user,
        });
        newOTP
            .save()
            .then((data) =>
			     mailer
					.send(
					  `${process.env.EMAIL_SMTP_USERNAME}`,
					  emailIdOrContact,
					  "Test Mail",
					  `<h1>Your OTP to login is `+newOTP.otp+` . This expires in 10 minutes.</h1>`
					)
					.then((result) => {
					  res
					  .status(200)
					  .json({
						  message: `OTP generated and sent to the entered email ID.`
					  })
					})
					.catch((err) => {
					  res
					  .status(500)
					  .json({
						  message: `Error in NodeMailer API`,
						  error : `${err}`
					  })
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
	}else{
		User.findOne({contact: emailIdOrContact}, (err, user) => {
        if (err) {
        res.status(404).json({
            message: "Unable to generate OTP for required user.",
        });
        } else {
        const newOTP = new OTP({
            otp: otp(),
            user,
        });
        newOTP
            .save()
            .then((data) =>
			     sms.sendOtp(
			           newOTP.otp, emailIdOrContact
		            ).then(() => {
					  res
					  .status(200)
					  .json({
						  message: `OTP generated and sent to the entered contact number.`
					  })
					})
					.catch((err) => {
					  res
					  .status(500)
					  .json({
						  message: `Error in sms sender API`,
						  error : `${err}`
					  })
					})
            )
            .catch((err) =>
            res.status(500).json({
                message: "Error saving new OTP vro",
                err: `${err}`,
            })
            );
        }
   		 });
	}
};

// Controller to fetch otp list and send it in response.
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

// Controller to generate a new OTP.
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