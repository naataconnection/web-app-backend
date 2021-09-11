require('dotenv').config();
const mailer = require('../helpers/mailer');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.responseEmail = (req, res) => {
    const receiverEmail = req.body.receiverEmail;

    console.log(req.body);

    mailer.send(
            `${process.env.EMAIL_SMTP_USERNAME}`,
            receiverEmail,
            "Test Mail",
            `<h1>This is Test Mail</h1>`
    )
    .then((result)=>{
        console.log(`Result from NodeMailer API is:${result}`);
    })
    .catch((err)=>{
        console.log(`Result from NodeMailer API is:${err}`);
    });
    res.send("Email Sent");
};

exports.registerUser = (req, res) => {
    User.find({'emailId':req.body.emailId})
    .then((result) => {
        console.log(result.length);

        if(result.length!=0){
            res
            .status(409)
            .json({
                message : `Email already exits.`
            });
        }
        else{
            const userData = req.body;
            const user = new User(userData);
            user._id = new mongoose.Types.ObjectId();
            console.log(user);

            user.save()
            .then((result)=>{
                res
                .status(200)
                .json({
                    message : `User Registraion Successful`,
                })
            })
            .catch((err)=>{
                res
                .status(500)
                .json({
                    message : `User Registeration Fails`,
                    error : `${err}`
                })
            });
        }
    })
    .catch((err) => {
        res
        .status(500)
        .json({
            message : `User Registeration Fails`,
            error : `${err}`
        });
    });
};
