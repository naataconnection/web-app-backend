require("dotenv").config();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const mailer = require("../helpers/mailer");
const User = require("../models/user");
const mongoose = require("mongoose");

const otp = require("../helpers/otp");
const OTP = require("../models/otp");

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
      console.log(`Result from NodeMailer API is:${result}`);
    })
    .catch((err) => {
      console.log(`Result from NodeMailer API is:${err}`);
    });
  res.send("Email Sent");
};

exports.registerUser = (req, res) => {
  var { userName, firstName, lastName, password, emailId } = req.body;
  console.log(req.body);
  if (!userName || !emailId || !password) {
    res.status(409).json({
      message: "Required fields are not present.",
    });
  }

  User.find({ emailId: emailId })
    .then((result) => {
      console.log(result.length);

      if (result.length != 0) {
        res.status(409).json({
          message: `Email already exits.`,
        });
      } else {
        const user = new User({
          userName,
          firstName,
          lastName,
          password,
          emailId,
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              message: `${err}`,
            });
          }
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
              console.log(err);
              res.status(500).json({
                message: `${err}`,
              });
            }
            user.password = hash;
            user
              .save()
              .then((result) => {
                res.status(200).json({
                  message: `User Registraion Successful`,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  message: `User Registeration Fails`,
                  error: `${err}`,
                });
              });
          });
        });

        console.log(user);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: `User Registeration Fails`,
        error: `${err}`,
      });
    });
};

exports.loginUser = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })(req, res, next);
};

// controller to generate new otp for particular user
exports.generateOTP = (req, res) => {
  User.findById(req.params.id, (err, user) => {
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
