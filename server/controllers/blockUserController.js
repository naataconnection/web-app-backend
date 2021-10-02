require("dotenv").config();
const User = require("../models/user");
const SuperUser = require("../models/superUser");

exports.userBlock = (req, res)=>{
    const {userCode} = req.body;

    User.findOne({userCode:userCode})
    .then((result)=>{
        const user  = result;

        if(user==null){
            res.status(404).json({
                message:`No User found with this UserCode`
            })
        }

        user.active = false;
        user.save()
        .then((result)=>{
            res.status(200).json({
                message:`User deactivated`
            })
        })
        .catch((err)=>{
            res.staus(500).json({
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

exports.superUserBlock = (req, res)=>{
    const {userCode} = req.body;

    superUser.findOne({userCode:userCode})
    .then((result)=>{
        const superUser  = result;

        if(superUser==null){
            res.status(404).json({
                message:`No User found with this UserCode`
            })
        }

        superUser.active = false;
        superUser.save()
        .then((result)=>{
            res.status(200).json({
                message:`User deactivated`
            })
        })
        .catch((err)=>{
            res.staus(500).json({
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