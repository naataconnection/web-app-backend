require('dotenv').config();
const axios = require('axios');

exports.sendOtp = (otp, phoneNumber)=>{
	const url = 'https://www.fast2sms.com/dev/bulkV2?authorization=b56CMGmfxBZtd4SRUXeh7qYDQlpgVPnWTziJAoaEHjc0rOILsFN6hD2RfHXzr5adQEVo4I3vtCTeLFPU&route=v3&sender_id=TXTIND&message=Your%20otp%20is%20'+otp+'&language=english&flash=1&numbers='+phoneNumber;
    return axios
	  .get(url)
	  .then(res => {
		console.log('SMS Sent');
	  })
	  .catch(error => {
		console.error(error)
	  })
};