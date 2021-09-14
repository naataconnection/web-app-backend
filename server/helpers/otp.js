const otpGenerator = require("otp-generator");

module.exports = () => {
  return otpGenerator.generate(6, {
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
};
