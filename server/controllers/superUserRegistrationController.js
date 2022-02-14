require("dotenv").config();
const { paddingZero } = require("../helpers/paddingZeros");
const SuperUser = require("../models/superUser");
const mailer = require("../helpers/mailer")

exports.registerSuperUser = async (req, res) => {
    var {firstName, middleName, lastName, emailId, contact, role} = req.body;

    if(!firstName || !emailId || !contact || !role){
        res.status(500).json({
            message:"provide all the neccessary details"
        })
    }

    role = role.toUpperCase();

    var userCode;

    if(role=="OWNER"){
        var result = await SuperUser.countDocuments({role:"OWNER"});
        result = paddingZero(result+1, 4);
        userCode = "NCOWNER"+result;
    }
    else if(role=="ADMIN"){
        var result = await SuperUser.countDocuments({role:"ADMIN"})
        result = paddingZero(result+1, 4);
        userCode = "NCADMIN"+result;
    };

    console.log(`${userCode}: usercode`);

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


        return res.status(200).json({
            message:"Super User successfully created"
        });
    })
    .catch((err)=>{
        return res.status(500).json({
            error:`${err}`
        })
    })
} 