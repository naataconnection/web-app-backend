require("dotenv").config();
const mailer = require("../helpers/mailer");
const User = require("../models/user");
const otp = require("../helpers/otp");
const OTP = require("../models/otp");
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
          return res
          .status(200)
          .json({
              message: `Verification Mail Sent`
          })
        })
        .catch((err) => {
          return res
          .status(500)
          .json({
              message: `Error in NodeMailer API`,
              error : `${err}`
          })
        });
    })
    .catch((err) => {
        return res
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

                return res
                .status(200)
                .json({
                    message: `Email Verification Successful`
                })
            }
            else{
                return res
                .status(400)
                .json({
                    message: `Wrong OTP`
                })
            }
        })
        .catch((err) => {
            return res
            .status(400)
            .json({
                message: `No OTP found for User`
            })
        });
    })
    .catch((err) => {
        return res
        .status(404)
        .json({
            message : 'No User found with this emailId',
            error: `${err}`
        })
    });
};