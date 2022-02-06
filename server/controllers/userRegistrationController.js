require("dotenv").config();
const User = require("../models/user");
const Driver = require("../models/driver");
const DeliveryBoy = require("../models/deliveryBoy");
const Manager = require("../models/manager");
const Customer = require("../models/customer");
const mailer = require("../helpers/mailer");
const { paddingZero } = require("../helpers/paddingZeros");
const dateTime = require("../utils/dateTimeFormat").dateDayTime;
const gCloudUrl = require("../helpers/gCloud").gCloudUrl;

// Controller to register a user.
exports.registerUser = async (req, res) => {
	var { firstName, middleName, lastName, emailId, contact, role } = req.body;

	if (!firstName || !emailId || !contact) {
		res.status(409).json({
			message: "Required fields are not present.",
		});
	}

	role = role.toUpperCase();


	const user = new User({
		firstName,
		middleName,
		lastName,
		emailId,
		contact,
		role
	});

	var userCode;

	try {
		await user.save();
	}
	catch (err) {
		return res.status(400).json({
			error: `${err}`
		})
	}


	if (role == "MANAGER") {
		var result = await Manager.countDocuments();
		userCode = "NCTP01" + paddingZero(result + 1, 4);

		const manager = new Manager({
			userCode,
			dateOfJoining: dateTime()[0],
			user
		});

		try {
			await manager.save();
		}
		catch (err) {
			return res.status(400).json({
				error: `${err}`
			})
		}
	}
	else if (role == "DRIVER") {
		var result = await Driver.countDocuments();
		userCode = "NCTP02" + paddingZero(result + 1, 4);

		const driver = new Driver({
			userCode,
			dateOfJoining: dateTime()[0],
			user
		});

		try {
			await driver.save();
		}
		catch (err) {
			return res.status(400).json({
				error: `${err}`
			})
		}
	}
	else if (role == "DELIVERY BOY") {
		var result = await DeliveryBoy.countDocuments();
		userCode = "NCTP03" + paddingZero(result + 1, 4);

		const deliveryBoy = new DeliveryBoy({
			userCode,
			dateOfJoining: dateTime()[0],
			user
		});

		try {
			await deliveryBoy.save();
		}
		catch (err) {
			return res.status(400).json({
				error: `${err}`
			})
		}
	}
	else if (role == "CUSTOMER") {
		var result = await Customer.countDocuments();
		userCode = "NCPR01" + paddingZero(result + 1, 4);

		const customer = new Customer({
			userCode,
			dateOfJoining: dateTime()[0],
			user
		});

		try {
			await customer.save();
		}
		catch (err) {
			return res.status(400).json({
				error: `${err}`
			})
		}
	}

	user.userCode = userCode;

	try {
		await user.save();
	}
	catch (err) {
		return res.status(400).json({
			error: `${err}`
		})
	}

	mailer.send(
		`${process.env.EMAIL_SMTP_USERNAME}`,
		emailId,
		"User Registered",
		`<p>
      ${user.firstName} ${user.lastName} has been registered on website with email - ${user.emailId}, phone number - ${user.contact} and UserCode - ${user.userCode}  
    <p>`
	);

	return res.status(200).json({
		message: `User Registraion Successful`,
	});
};

module.exports.registerDriver = async (req, res) => {

	try{
		var i = 0;
		var drivingLicense = null, idCard1 = null, idCard2 = null, profileImage = null;

		if(req.body.isDrivingLicense == "1"){
			drivingLicense = await gCloudUrl(req.files[i].path, "driver/");
			i++;
		}

		if(req.body.isIdCard1 == "1"){
			idCard1 = await gCloudUrl(req.files[i].path, "driver/");
			i++;
		}

		if(req.body.isIdCard2 == "1"){
			idCard2 = await gCloudUrl(req.files[i].path, "driver/");
			i++;
		}

		if(req.body.isProfileImage == "1"){
			profileImage = await gCloudUrl(req.files[i].path, "driver/");
			i++;
		}

		var {
			userCode,
			address,
			city,
			state,
			age,
			drivingLicenseType,
			drivingLicenseExpireDate,
			secondaryContact,
			bloodGroup,
		} = req.body;

		const driver = await Driver.updateOne(
			{ userCode },
			{
				address,
				city,
				state,
				age,
				drivingLicenseType,
				drivingLicense,
				drivingLicenseExpireDate,
				idCard1,
				secondaryContact,
				idCard2,
				bloodGroup,
				profileImage,
			},
		)

		if(driver.matchedCount){
			return res.status(200).json({
				message: "Fields Updated for driver profile",
			});
		}else{
			return res.status(404).json({
				message: "No driver profile found with this userCode",
			});
		}

	}catch(error){
		return res.status(500).json({
			error: `${error}`,
		});
	}
};

module.exports.registerManager = async (req, res) => {

	try{

		var i = 0;
		var idCard, profileImage;

		if(req.body.isIdCard == "1"){
			idCard = await gCloudUrl(req.files[i].path, "manager/");
			i++;
		}

		if(req.body.isProfileImage == "1"){
			profileImage = await gCloudUrl(req.files[i].path, "manager/");
			i++;
		}

		var { userCode, dateOfJoining, secondaryContact, emergencyContact, bloodGroup } = req.body;

		const manager = await Manager.updateOne(
			{ userCode },
			{
				dateOfJoining,
				secondaryContact,
				idCard,
				emergencyContact,
				bloodGroup,
				profileImage,
			},
		)

		if(manager.matchedCount){
			return res.status(200).json({
				message: "Fields Updated for manager profile",
			});
		}else{
			return res.status(404).json({
				message: "No driver profile found with this userCode",
			});
		}

	}catch(error){
		return res.status(500).json({
			error: `${error}`,
		});
	}
};

module.exports.registerDeliveryBoy = async (req, res) => {

	try{
		var i = 0;
		var idCard1 = null, idCard2 = null, profileImage = null;

		if(req.body.isIdCard1 == "1"){
			idCard1 = await gCloudUrl(req.files[i].path, "deliveryBoy/");
			i++;
		}

		if(req.body.isIdCard2 == "1"){
			idCard2 = await gCloudUrl(req.files[i].path, "deliveryBoy/");
			i++;
		}

		if(req.body.isProfileImage == "1"){
			profileImage = await gCloudUrl(req.files[i].path, "deliveryBoy/");
			i++;
		}

		var {
			userCode,
			address,
			city,
			state,
			age,
			secondaryContact,
			emergencyContact,
			bloodGroup,
		} = req.body;

		const deliveryBoy = DeliveryBoy.updateOne(
			{ userCode },
			{
				address,
				city,
				state,
				age,
				idCard1,
				secondaryContact,
				idCard2,
				emergencyContact,
				bloodGroup,
				profileImage,
			},
		);

		if(deliveryBoy.matchedCount){
			return res.status(200).json({
				message: "Fields Updated for delivery boy profile",
			});
		}else{
			return res.status(404).json({
				message: "No delivery profile found with this userCode",
			});
		}

	}catch(error){
		return res.status(500).json({
			error: `${error}`,
		});
	}
};

module.exports.registerCustomer = async (req, res) => {

	try{
		var profileImage = null;
		if(req.body.isProfileImage == "1"){
			profileImage = await gCloudUrl(req.file.path, "customer/");
		}

		var {
			userCode,
			companyName,
			department,
			address,
			city,
			state,
			secondaryContact,
			gst,
		} = req.body;
	
		var customer = await Customer.updateOne(
			{ userCode },
			{
				companyName,
				department,
				address,
				city,
				state,
				secondaryContact,
				gst,
				profileImage,
			},
		)

		if(customer.matchedCount){
			return res.status(200).json({
				message: "Fields Updated for customer profile",
			});
		}else{
			return res.status(404).json({
				message: "No customer profile found with this userCode",
			});
		}


	}catch(error){
		return res.status(500).json({
			error: `${error}`,
		});
	}
};
