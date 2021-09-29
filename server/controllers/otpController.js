require("dotenv").config();
const User = require("../models/user");
const otp = require("../helpers/otp");
const OTP = require("../models/otp");
const mailer = require("../helpers/mailer");

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

// Controller to generate a new OTP for a particular user and send it.
exports.generateAndSendOTP = (req, res) => {
    const emailId = req.body.emailId;

    User.findOne({emailId: emailId}, (err, user) => {
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
			     mailer
					.send(
					  `${process.env.EMAIL_SMTP_USERNAME}`,
					  emailId,
					  "Test Mail",
					  `<h1>This is Test Mail`+newOTP.otp+`</h1>`
					)
					.then((result) => {
					  res
					  .status(200)
					  .json({
						  message: `OTP generated and sent.`
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
  				// res.send("Email Sent");
				// res.status(200).json({
				// 	otp: data.otp,
				// 	message: "OTP generated and sent.",
				// })
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