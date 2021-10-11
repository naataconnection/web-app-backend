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

