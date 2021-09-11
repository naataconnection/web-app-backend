require('dotenv').config();
const mailer = require('../helpers/mailer');

exports.responseEmail = (req, res) => {
    const receiverEmail = req.body.receiverEmail;

    console.log(req.body);

    try{
        mailer.send(
            `${process.env.EMAIL_SMTP_USERNAME}`,
            receiverEmail,
            "Test Mail",
            `<h1>This is Test Mail</h1>`
        )
    }
    catch(err){
        console.log(err);
    }


    res.send("Email Sent");
};
