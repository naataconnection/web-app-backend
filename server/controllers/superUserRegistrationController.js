require("dotenv").config();
const SuperUser = require("../models/superUser");

exports.registerSuperUser = (req, res) => {
    var {firstName, middleName, lastName, emailId, contact, role} = req.body();

    if(!firstName || !emailId || !contact || !role){
        res.status(500).json({
            message:"provide all the neccessary details"
        })
    }

    role = role.toUpperCase();

    SuperUser.findOne({emailId})
    .then((result)=>{
        if(result!=null){
            res.status(500).json({
                message:"User already exists with emailId"
            });
        }

        const superUser = new SuperUser({
            firstName,
            middleName,
            lastName,
            emailId,
            contact,
            role
        });

        superUser.save()
        .then((result)=>{
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
            error:`${err}`
        })
    })
} 