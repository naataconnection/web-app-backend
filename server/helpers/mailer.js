require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:'587',
    auth:{
        user:`${process.env.EMAIL_SMTP_USERNAME}`,
        pass:`${process.env.EMAIL_SMTP_PASSWORD}`,
    },
    tls:{
        rejectUnauthorized: false
    },  
});

exports.send = (from, to, subject, html)=>{
    console.log("from to subject html");
    console.log(from, to, subject, html);

    try{
        return transporter.sendMail({
            from : from,
            to : to,
            subject : subject,
            html : html, 
        });
    }
    catch(err){
        console.log(err);
    }

};