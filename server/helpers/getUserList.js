const users = require("../models/user");
const Driver = require("../models/driver");
const DeliveryBoy = require("../models/deliveryBoy");
const Manager = require("../models/manager");
const Customer = require("../models/customer");

module.exports.getUsersList = async (req, res) => {
    try {
		const firstName = req.body.firstName;
        const userList = await users.find({firstName: firstName}).select({ "firstName": 1, "lastName": 1, "middleName": 1, "userCode": 1, "role":1 });
        res.status(200).json({ success: "true", data: userList });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: "false", error: `${error}` });
    }
}

module.exports.getUserProfile = async (req, res) => {
    try {
		const userCode = req.body.userCode;
        const user = await users.findOne({userCode: userCode});
		let profile = null;
		if(user.role == "DRIVER" ){
		   profile = await Driver.findOne({user:user});
		}
		if(user.role == "MANAGER" ){
		   profile = await Manager.findOne({user:user});
		}
		if(user.role == "DELIVERY BOY" ){
		   profile = await DeliveryBoy.findOne({user:user});
		}
		if(user.role == "CUSTOMER" ){
		   profile = await Customer.findOne({user:user});
		}
        return res.status(200).json({ success: "true", data: {user, profile} });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: "false", error: `${error}` });
    }
}

module.exports.getDriver = async (req, res) => {
	try{
		const userCode = req.body.userCode;
        const user = await Driver.findOne({userCode: userCode});
		res.status(200).json({ success: "true", data: user });
	}catch(error){
		console.log(error);
        return res.status(400).json({ success: "false", error: `${error}` });
	}
}

module.exports.getDeliveryBoy = async (req, res) => {
	try{
		const userCode = req.body.userCode;
        const user = await DeliveryBoy.findOne({userCode: userCode});
		res.status(200).json({ success: "true", data: user });
	}catch(error){
		console.log(error);
        return res.status(400).json({ success: "false", error: `${error}` });
	}
}

module.exports.getManager = async (req, res) => {
	try{
		const userCode = req.body.userCode;
        const user = await Manager.findOne({userCode: userCode});
		res.status(200).json({ success: "true", data: user });
	}catch(error){
		console.log(error);
        return res.status(400).json({ success: "false", error: `${error}` });
	}
}

module.exports.getCustomer = async (req, res) => {
	try{
		const userCode = req.body.userCode;
        const user = await Customer.findOne({userCode: userCode});
		res.status(200).json({ success: "true", data: user });
	}catch(error){
		console.log(error);
        return res.status(400).json({ success: "false", error: `${error}` });
	}
}

module.exports.allDriver = async (req, res) => {
	try{
		const user = await Driver.find();
		if(user[0]){
			return res.status(200).json({ success: "true", data: user});
		}
		res.status(200).json({ success: "true", message: "No driver exists"});
	}catch(error){
		return res.status(400).json({ success: "false", error: `${error}`});
	}
}

module.exports.allDeliveryBoy = async (req, res) => {
	try{
		const user = await DeliveryBoy.find();
		if(user[0]){
			return res.status(200).json({ success: "true", data: user});
		}
		res.status(200).json({ success: "true", message: "No deliveryboy exists"});
	}catch(error){
		return res.status(400).json({ success: "false", error: `${error}`});
	}
}

module.exports.allManagerwithName = async (req, res) => {
	try{
        const userList = await Manager.find();
		var result = [];
		if(userList.length > 0){
			for(var i = 0;i < userList.length; i++){
				const details = await users.findOne({userCode: userList[i].userCode}).select({"firstName": 1, "middleName": 1, "lastName": 1});
				result.push(details);
			}
		}else{
			res.status(200).json({ success: "true", message: "No manager exists"});
		}
		res.status(200).json({ success: "true",  data: userList, driver: result});
	}catch(error){
		console.log(error);
        return res.status(400).json({ success: "false", error: `${error}` });
	}
}

module.exports.allCustomerwithName = async (req, res) => {
	try{
		const userList = await Customer.find();
		var result = [];
		if(userList.length > 0){
			for(var i = 0;i < userList.length; i++){
				const details = await users.findOne({userCode: userList[i].userCode}).select({"userCode": 1, "firstName": 1, "middleName": 1, "lastName": 1});
				result.push(details);
			}
		}else{
			res.status(200).json({ success: "true", message: "No customer exists"});
		}
		res.status(200).json({ success: "true",  data: userList, driver: result});
	}catch(error){
		console.log(error);
        return res.status(400).json({ success: "false", error: `${error}` });
	}
}

module.exports.allDriverwithName = async (req, res) => {
	try{
		const userList = await Driver.find();
		var result = [];
		if(userList.length > 0){
			for(var i = 0;i < userList.length; i++){
				const details = await users.findOne({userCode: userList[i].userCode}).select({"userCode": 1, "firstName": 1, "middleName": 1, "lastName": 1});
				result.push(details);
			}
		}else{
			res.status(200).json({ success: "true", message: "No driver exists"});
		}
		res.status(200).json({ success: "true",  data: userList, driver: result});
	}catch(error){
		return res.status(400).json({ success: "false", error: `${error}`});
	}
}

module.exports.allDeliveryBoywithName = async (req, res) => {
	try{
		const userList = await DeliveryBoy.find();
		var result = [];
		if(userList.length > 0){
			for(var i = 0;i < userList.length; i++){
				const details = await users.findOne({userCode: userList[i].userCode}).select({"userCode": 1, "firstName": 1, "middleName": 1, "lastName": 1});
				result.push(details);
			}
		}else{
			res.status(200).json({ success: "true", message: "No deliveryBoy exists"});
		}
		res.status(200).json({ success: "true", data: userList, driver: result});
	}catch(error){
		return res.status(400).json({ success: "false", error: `${error}`});
	}
}

module.exports.users = async (req, res) => {
	try{
		const userList = await users.find().select({"userCode": 1, "firstName": 1, "middleName": 1, "lastName": 1});
		if(userList.length > 0){
			res.status(200).json({ success: "true", data: userList});
		}
		res.status(200).json({success: "true", message: "No User exists"});
	}catch(error){
		consle.log(error);
		return res.status(400).json({ success: "false", error: `${error}`});
	}
}

