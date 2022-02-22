const vendorContact = require("../models/vendorContact");
const mailer = require("../helpers/mailer");
const {vendororGenericEmailFormat} = require("../helpers/mailFormat");

var globalId = 0;

const getId = async () => {
  const user = await vendorContact.find().sort({ vendorId: -1 }).limit(1);
  if (user[0]) {
    globalId = user[0].vendorId;
  }
};

getId();

exports.createOne = async (req, res) => {
  try {
    globalId++;
    const vendorId = globalId;
    const { companyName, personName, email, contactNumber, message } = req.body;
    const newEntry = await vendorContact.create({
      vendorId,
      companyName,
      personName,
      email,
      contactNumber,
      message,
    });

    const [subject, body] = vendororGenericEmailFormat(personName, vendorId);

    await mailer.send(
      `${process.env.EMAIL_SMTP_USERNAME}`, email, subject, body
    );

    return res.status(200).json({
      message: "vendor Contact Successfully created!"
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      error:`${error}`
  })
  }
};
