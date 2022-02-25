require("dotenv").config();
const { paddingZero } = require("../helpers/paddingZeros");
const SuperUser = require("../models/superUser");
const mailer = require("../helpers/mailer");
const {registrationFormat} = require("../helpers/mailFormat");

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

    var name = superUser.firstName;
	if(superUser.middleName){
		name += " " + superUser.middleName;
	}
	if(superUser.lastName){
		name += " " + superUser.lastName;
	}
	const [subject, body] = registrationFormat(superUser.userCode, name, contact, emailId);

    superUser.save()
    .then((result)=>{
        mailer.send(
            `${process.env.EMAIL_SMTP_USERNAME}`, emailId, subject, body
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