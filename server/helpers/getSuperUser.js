const superUsers = require("../models/superUser");

module.exports.getSuperUserProfile = async (req, res) => {
    try {
		const userCode = req.body.userCode;
        const superUser = await superUsers.findOne({userCode: userCode});
		let profile = superUser;
        return res.status(200).json({ success: "true", data: {superUser, profile} });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: "false", error: `${error}` });
    }
}

module.exports.getAdmin = async (req, res) => {
	try{
		const userCode = req.body.userCode;
        const user = await superUsers.findOne({userCode: userCode, role: "ADMIN"});
		res.status(200).json({ success: "true", data: user });
	}catch(error){
		console.log(error);
        return res.status(400).json({ success: "false", error: `${error}` });
	}
}

module.exports.allsuperUser = async (req, res) => {
    try{
        const user = await superUsers.find();
        if(user.length > 0){
            return res.status(200).json({ success: "true", data: user});
        }
		res.status(200).json({ success: "true", message: "No superUser exists"});
    }catch(error){
        console.log(error);
        return res.status(400).json({ success: "false", error: `${error}` });
    }
}

module.exports.allAdmin = async (req, res) => {
    try{
        const user = await superUsers.find({role: "ADMIN"});
        if(user.length > 0){
            return res.status(200).json({ success: "true", data: user });
        }
		res.status(200).json({ success: "true", message: "No admin exists"});
    }catch(error){
        console.log(error);
        return res.status(400).json({ success: "false", error: `${error}` });
    }
}

module.exports.allOwner = async (req, res) => {
    try{
        const user = await superUsers.find({role: "OWNER"});
        if(user.length > 0){
            return res.status(200).json({ success: "true", data: user });
        }
		res.status(200).json({ success: "true", message: "No owner exists"});
    }catch(error){
        console.log(error);
        return res.status(400).json({ success: "false", error: `${error}` });
    }
}

