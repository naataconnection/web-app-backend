require("dotenv").config();
const User = require("../models/user");
const SuperUser = require("../models/superUser");

exports.userBlock = async (req, res)=>{
    try{
        const {userCode} = req.body;
        const result = await User.findOne({userCode:userCode});
        if(result == null){
            return res.status(404).json({message:`No User found with this UserCode`});
        }
        result.active = false;
        await result.save();
        return  res.status(200).json({message:`User deactivated`});
    }catch(error){
        return res.status(500).json({error:`${error}`});
    }
}

exports.superUserBlock = async (req, res)=>{
    try{
        const {userCode} = req.body;
        const result = await SuperUser.findOne({userCode:userCode});
        if(result == null){
            return res.status(404).json({message:`No User found with this UserCode`});
        }
        result.active = false;
        await result.save();
        return  res.status(200).json({message:`Super User deactivated`});
    }catch(error){
        return res.status(500).json({error:`${error}`});
    }
}