require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host:'smtp.gmail.com',
    port: 587,
    secure: false,
    auth:{
        user:`${process.env.EMAIL_SMTP_USERNAME}`,
        pass:`${process.env.EMAIL_SMTP_PASSWORD}`,
    },
    logger: true 
});

exports.send = (from, to, subject, html)=>{
    return transporter.sendMail({
            from : from,
            to : to,
            subject : subject,
            html : html, 
        })
        .then((result) =>{
            console.log(result);
        })
        .catch((err)=>{
            console.log(err);
        })

};