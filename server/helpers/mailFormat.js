const vendororGenericEmailFormat = (name, token) => {
    const subject = `Thanks for Reaching out to us !!`;
    const body = `
    Hi <b>${name}</b>,
    <br>
    <p>Thanks so much for reaching out! Your token number is <b>${token}</b>.</p>
    <p>We have received your message and will get back to you with a (human) response as soon as possible.</p>
    <p>If you have any additional information that you think will help us to assist you, please feel free to send us an email at support@naataconnection.com</p>
    <p>We look forward to chatting soon!</p>
 
    Best Wishes,<br>
    <b>Naata Connection Team</b><br>
    www.naataconnnection.com
    `
    return [subject, body];
}

const otpFormat = (name, otp) => {

    const subject = `One Time Password (OTP) for your Naata Connection account`;
    const body = `
    Hi <b>${name}</b>,
    <br>
    <p>Welcome to Naata Connection!</p>
    <p>Use <b>${otp}</b> as One Time Password (OTP) to log in to your Naata Connection account. This OTP is valid for 10 minutes.</p>
    <p>Please do not share this OTP with anyone for security reasons.</p>
    
    Best Wishes,<br>
    <b>Naata Connection Team</b><br>
    www.naataconnnection.com
    `
    return [subject, body];
}

const registrationFormat = (userCode, name, contactNo, email) => {
    const subject = `Welcome! Successful registration at Naata Connection!`;
    const body = `
    Hi <b>${name}</b>,
    <br>
    <p>Welcome to Naata Connection!</p>
    <p>You have been successfully registered at Naata Connection. You can login into your account from www.naataconnnection.com</p>
    <p>Registration Details:</p>
    
    <b>User Code:</b> ${userCode}<br>
    <b>Name:</b> ${name}<br>
    <b>Mobile Number:</b> ${contactNo}<br>
    <b>Email:</b> ${email}<br>
    <br>
    Best Wishes,<br>
    <b>Naata Connection Team</b><br>
    www.naataconnnection.com
    `
    return [subject, body];
}   

const smsFormat = (otp) => {
    const message = `
    Use ${otp} as One Time Password (OTP) to log in to your Naata Connection account.This OTP is valid for 10 minutes.
    %0a-Naata Connection Team
    `;
    return message;
}

const registrationSmsFormat = (userCode, name, contactNo, email) => {
    const message = `Registration Details:
    %0aUser Code: ${userCode}%0aName: ${name}%0aMobile Number: ${contactNo}%0aEmail: ${email}
    %0a-Naata Connection Team
    `
    return message;
}

module.exports = {
    vendororGenericEmailFormat,
    otpFormat,
    registrationFormat,
    smsFormat,
    registrationSmsFormat,
}

