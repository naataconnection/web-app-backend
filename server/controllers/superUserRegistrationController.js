require("dotenv").config();
const { paddingZero } = require("../helpers/paddingZeros");
const SuperUser = require("../models/superUser");
const mailer = require("../helpers/mailer")

exports.registerSuperUser = (req, res) => {
    var {firstName, middleName, lastName, emailId, contact, role} = req.body;

    if(!firstName || !emailId || !contact || !role){
        res.status(500).json({
            message:"provide all the neccessary details"
        })
    }

    role = role.toUpperCase();

    var userCode;

    if(role=="OWNER"){
        SuperUser.countDocuments({role:"OWNER"})
        .then((result)=>{
            result+=1;
            result = paddingZero(result, 4);
            userCode="NCOWNER"+result;
            const superUser = new SuperUser({
                firstName,
                middleName,
                lastName,
                emailId,
                contact,
                role,
                userCode
            });

            superUser.save()
            .then((result)=>{
                mailer.send(
                    `${process.env.EMAIL_SMTP_USERNAME}`,
                    emailId,
                    "User Registered",
                    `<p>
                      ${superUser.firstName} ${superUser.lastName} has been registered on website with email - ${superUser.emailId}, phone number - ${superUser.contact} and UserCode - ${superUser.userCode}  
                    <p>`
                  );


                res.status(200).json({
                    message:"Super User successfully created"
                });
            })
            .catch((err)=>{
                res.status(500).json({
                    error:`${err}`
                })
            })
        })
        .catch((err)=>{
            res.status(500).json({
                err:`${err}`
            })
        })
    }
    else if(role=="ADMIN"){
        SuperUser.countDocuments({role:"ADMIN"})
        .then((result)=>{
            result+=1;
            result = paddingZero(result, 4);
            userCode="NCADMIN"+result;
            const superUser = new SuperUser({
                firstName,
                middleName,
                lastName,
                emailId,
                contact,
                role,
                userCode
            });

            superUser.save()
            .then((result)=>{

                mailer.send(
                    `${process.env.EMAIL_SMTP_USERNAME}`,
                    emailId,
                    "User Registered",
                    `<p>
                      ${superUser.firstName} ${superUser.lastName} has been registered on website with email - ${superUser.emailId}, phone number - ${superUser.contact} and UserCode - ${superUser.userCode}  
                    <p>`
                  );

                res.status(200).json({
                    message:"Super User successfully created"
                });
            })
            .catch((err)=>{
                res.status(500).json({
                    error:`${err}`
                })
            })
        })
        .catch((err)=>{
            res.status(500).json({
                err:`${err}`
            })
        })
    };
} 