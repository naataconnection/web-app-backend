const vendorContact = require("../models/vendorContact");

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
    return res.status(200).send(newEntry);
  } catch (error) {
    console.log(error);
    return res.status(404).send(error);
  }
};
