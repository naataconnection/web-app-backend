require("dotenv").config();
const User = require("../models/user");
const Driver = require("../models/driver");
const DeliveryBoy = require("../models/deliveryBoy");
const Manager = require("../models/manager");
const Customer = require("../models/customer");
const mailer = require("../helpers/mailer");
const { paddingZero } = require("../helpers/paddingZeros");
const dateTime = require("../utils/dateTimeFormat").dateDayTime;
const fs = require("fs");
const uploadFile = require("../utils/gCloud").uploadFile;

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

	const DLPath = req.files[0].path.replace('\\', '/');
	const localdestDL = __dirname + "/../../public/profile/" + DLPath.substring(DLPath.lastIndexOf('\\') + 1);
	const DLdestPath = "driver/" + DLPath.substring(DLPath.lastIndexOf('\\') + 1);
	let DLurl = uploadFile(localdestDL, DLdestPath);
	DLurl = await Promise.all([DLurl]);
	fs.unlinkSync(localdestDL);

	const kycPath = req.files[1].path.replace('\\', '/');
	const localdestkyc = __dirname + "/../../public/profile/" + kycPath.substring(kycPath.lastIndexOf('\\') + 1);
	const kycdestPath = "driver/" + kycPath.substring(kycPath.lastIndexOf('\\') + 1);
	let kycUrl = uploadFile(localdestkyc, kycdestPath);
	kycUrl = await Promise.all([kycUrl]);
	fs.unlinkSync(localdestkyc);

	const idCardPath = req.files[2].path.replace('\\', '/');
	const localdestidCard = __dirname + "/../../public/profile/" + idCardPath.substring(idCardPath.lastIndexOf('\\') + 1);
	const idCarddestPath = "driver/" + idCardPath.substring(idCardPath.lastIndexOf('\\') + 1);
	let idCardUrl = uploadFile(localdestidCard, idCarddestPath);
	idCardUrl = await Promise.all([idCardUrl]);
	fs.unlinkSync(localdestidCard);

	var drivingLicense = DLurl[0];
	var kyc = kycUrl[0];
	var idCard = idCardUrl[0];

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
			kyc,
			secondaryContact,
			idCard,
			bloodGroup,
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

	const idCardPath = req.file.path.replace('\\', '/');
	const localdestidCard = __dirname + "/../../public/profile/" + idCardPath.substring(idCardPath.lastIndexOf('\\') + 1);
	const idCarddestPath = "manager/" + idCardPath.substring(idCardPath.lastIndexOf('\\') + 1);
	let idCardUrl = uploadFile(localdestidCard, idCarddestPath);
	idCardUrl = await Promise.all([idCardUrl]);
	fs.unlinkSync(localdestidCard);

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

	const kycPath = req.files[0].path.replace('\\', '/');
	const localdestkyc = __dirname + "/../../public/profile/" + kycPath.substring(kycPath.lastIndexOf('\\') + 1);
	const kycdestPath = "deliveryBoy/" + kycPath.substring(kycPath.lastIndexOf('\\') + 1);
	let kycUrl = uploadFile(localdestkyc, kycdestPath);
	kycUrl = await Promise.all([kycUrl]);
	fs.unlinkSync(localdestkyc);

	const idCardPath = req.files[1].path.replace('\\', '/');
	const localdestidCard = __dirname + "/../../public/profile/" + idCardPath.substring(idCardPath.lastIndexOf('\\') + 1);
	const idCarddestPath = "deliveryBoy/" + idCardPath.substring(idCardPath.lastIndexOf('\\') + 1);
	let idCardUrl = uploadFile(localdestidCard, idCarddestPath);
	idCardUrl = await Promise.all([idCardUrl]);
	fs.unlinkSync(localdestidCard);

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

	var kyc = kycUrl[0];
	var idCard = idCardUrl[0];

	DeliveryBoy.updateOne(
		{ userCode },
		{
			address,
			city,
			state,
			age,
			kyc,
			secondaryContact,
			idCard,
			emergencyContact,
			bloodGroup,
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
