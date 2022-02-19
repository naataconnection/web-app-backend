const genericContact = require("../models/genericContact");
const mailer = require("../helpers/mailer");

var globalId = 0;

const getId = async () => {
  const user = await genericContact.find().sort({ genericId: -1 }).limit(1);
  if (user[0]) {
    globalId = user[0].genericId;
  }
};
getId();

exports.createOne = async (req, res) => {
  try {
    globalId++;
    const genericId = globalId;
    const { name, email, message } = req.body;
    const newEntry = await genericContact.create({
      genericId,
      name,
      email,
      message,
    });

    await mailer.send(
      `${process.env.EMAIL_SMTP_USERNAME}`,
      email,
      "Generic Contact Registered",
      `<p>
        Name ${name} has been requested for generic contact on website with email - ${email}, message - ${message} and unique token Id - ${genericId}  
      <p>`
    );

    return res.status(200).json({
      message: "Generic Contact Successfully created!"
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
        error:`${error}`
    })
  }
};

exports.getAll = async (req, res) => {
  try {
    const responses = await genericContact.find({});
    res.status(200).json(responses);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
