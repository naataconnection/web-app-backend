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
		res.status(400).json({
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
			res.status(400).json({
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
			res.status(400).json({
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
			res.status(400).json({
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
			res.status(400).json({
				error: `${err}`
			})
		}
	}

	user.userCode = userCode;

	try {
		await user.save();
	}
	catch (err) {
		res.status(400).json({
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


exports.registerDriver = async (req, res) => {

	var drivingLicense, idCard1, idCard2, profileImage;
	if(req.files && req.files.length > 0){
		drivingLicense = await gCloudUrl(req.files[0].path, "driver/");
		idCard1 = await gCloudUrl(req.files[1].path, "driver/");
		idCard2 = await gCloudUrl(req.files[2].path, "driver/");
		profileImage = await gCloudUrl(req.files[3].path, "driver/");
	}else{
		res.status(404).json({
			message: "File doesn't exist",
		});
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

	Driver.updateOne(
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
		(err, result) => {
			if (err) {
				res.status(500).json({
					error: `${err}`,
				});
			}

			if (res == null) {
				res.status(404).json({
					message: "No driver profile found with this userCode",
				});
			}

			res.status(200).json({
				message: "Fields Updated for driver profile",
			});
		}
	);
};

exports.registerManager = async (req, res) => {

	var idCard, profileImage;
	if(req.files && req.files.length > 0){
		idCard = await gCloudUrl(req.files[0].path, "manager/");
		profileImage = await gCloudUrl(req.files[1].path, "manager/");
	}else{
		res.status(404).json({
			message: "File doesn't exist",
		});
	}

	var { userCode, dateOfJoining, secondaryContact, emergencyContact, bloodGroup } =
		req.body;

	Manager.updateOne(
		{ userCode },
		{
			dateOfJoining,
			secondaryContact,
			idCard,
			emergencyContact,
			bloodGroup,
			profileImage,
		},
		(err, result) => {
			if (err) {
				res.status(500).json({
					error: `${err}`,
				});
			}

			if (res == null) {
				res.status(404).json({
					message: "No driver profile found with this userCode",
				});
			}

			res.status(200).json({
				message: "Fields Updated for manager profile",
			});
		}
	);
};

exports.registerDeliveryBoy = async (req, res) => {

	var idCard1, idCard2, profileImage;
	if(req.files && req.files.length > 0){
		idCard1 = await gCloudUrl(req.files[0].path, "deliveryBoy/");
		idCard2 = await gCloudUrl(req.files[1].path, "deliveryBoy/");
		profileImage = await gCloudUrl(req.files[2].path, "deliveryBoy/");
	}else{
		res.status(404).json({
			message: "File doesn't exist",
		});
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

	DeliveryBoy.updateOne(
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
		(err, result) => {
			if (err) {
				res.status(500).json({
					error: `${err}`,
				});
			}

			if (res == null) {
				res.status(404).json({
					message: "No driver profile found with this userCode",
				});
			}

			res.status(200).json({
				message: "Fields Updated for delivery boy profile",
			});
		}
	);
};

exports.registerCustomer = (req, res) => {

	var profileImage;
	if(req.file && req.file.length > 0){
		profileImage = await gCloudUrl(req.file.path, "customer/");
	}else{
		res.status(404).json({
			message: "File doesn't exist",
		});
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

	Customer.updateOne(
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
		(err, result) => {
			if (err) {
				res.status(500).json({
					error: `${err}`,
				});
			}

			if (res == null) {
				res.status(404).json({
					message: "No driver profile found with this userCode",
				});
			}

			res.status(200).json({
				message: "Fields Updated for customer profile",
			});
		}
	);
};
