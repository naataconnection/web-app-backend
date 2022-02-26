const genericContact = require("../models/genericContact");
const mailer = require("../helpers/mailer");
const {vendororGenericEmailFormat} = require("../helpers/mailFormat");

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

    const [subject, body] = vendororGenericEmailFormat(name, genericId);

    await mailer.send(`${process.env.EMAIL_SMTP_USERNAME}`,email, subject, body);

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
