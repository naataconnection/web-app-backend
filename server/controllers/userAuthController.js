require("dotenv").config();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

// Controller to register a user.
exports.registerUser = (req, res) => {
var { firstName, middleName, lastName, password, emailId, contact, employeeCode} = req.body;

  if (!firstName || !emailId || !password || !employeeCode) {
    res.status(409).json({
      message: "Required fields are not present.",
    });
  }

  employeeCode = employeeCode.toUpperCase();
//   console.log(`CC is ${companyCode} and ${companyCode.slice(0,1)}`)

employeeCode = employeeCode.toUpperCase();
//   console.log(`CC is ${companyCode} and ${companyCode.slice(0,1)}`)

  if(employeeCode.slice(0,2)!="NC"){
    res.status(500).json({
        message: "Invalid Employee Code"
    })
  }

  User.find({ emailId: emailId })
    .then((result) => {
      // console.log(result.length);

      if (result.length != 0) {
        return res.status(409).json({
          message: `Email already exits.`,
        });
      } else {
        const user = new User({
          firstName,
          middleName,
          lastName,
          password,
          emailId,
          contact,
          employeeCode
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            // console.log(err);
            return res.status(500).json({
              message: `${err}`,
            });
          }
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
              // console.log(err);
              return res.status(500).json({
                message: `${err}`,
              });
            }
            user.password = hash;
            user
              .save()
              .then((result) => {
                return res.status(200).json({
                  message: `User Registraion Successful`,
                });
              })
             .catch((err) => {
                res.status(500).json({
                  message: `Incorrect Data Provided`,
                  error: `${err}`,
                });
              });
          });
        });

        console.log(user);
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: `No User found with this emailId`,
        error: `${err}`,
      });
    });
};

// Controller to login the user.
exports.loginUser = (req, res, next) => {
  passport.authenticate("local", (err,user,info)=>{
    if(err){
		// console.log(info.message);
		return res.status(400).json({
        message: info.message,
        error: `${err}`,
        });
	}
	else if(!user){
		return res.status(400).json({
		message: info.message,
		});
	}else{
		const employeeCode = user.employeeCode;
		const token = jsonwebtoken.sign({ user: employeeCode, maxAge: parseInt(process.env.MAX_AGE) }, process.env.SECRET);
		res.cookie('token', token, { httpOnly: true, maxAge: parseInt(process.env.MAX_AGE), secure: true });
		return res.status(200).json({message:info.message});
	}
  })(req, res, next);
};

// Controller to logout the user.
exports.logoutUser = (req,res,next) => {
	const token = req.cookies.token;
	if(token){
		jsonwebtoken.verify(token,process.env.SECRET,(err,code)=>{
			if(err){
			   return  res.status(400).json({message:"Invalid Token!!!Pls login with correct credentials"});
		   } else {
			  res.clearCookie('token');
			  res.clearCookie('employeeCode');
			  const message = "User with employee code "+code.user+" is logged out successfullly";
			  res.status(200).json({message:message});
		   }	
		});
	}else {
		res.status(400).json({message:"Token Not Found...Pls Login First!!!"});
	}
};

// Controller to verify the jwt tokens of user in any API.
exports.verifyUser = (req,res) => {
   const token = req.cookies.token;
	if(token){
		jsonwebtoken.verify(token,process.env.SECRET,(err,code)=>{
			if(err){
			   return  res.status(400).json({message:"Invalid Token!!!Pls login with correct credentials"});
		   } else {
			  const message = "Authorization of user with employee code "+code.user+" is verified";
			  res.status(200).json({message:message});
		   }	
		});
	}else {
		res.status(400).json({message:"Token Not Found...Pls Login First!!!"});
	}
};