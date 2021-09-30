require("dotenv").config();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");
const Driver = require("../models/driver");
const DeliveryBoy = require("../models/deliveryBoy");
const Manager = require("../models/manager");


// Controller to register a user.
exports.registerUser = (req, res) => {
  var { firstName, middleName, lastName, emailId, contact, role} = req.body;
  
    if (!firstName || !emailId || !contact) {
      res.status(409).json({
        message: "Required fields are not present.",
      });
    }

    role = role.toUpperCase();

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
            emailId,
            contact,
            userCode:companyCode,
            role
          });
          var companyCode;
          user.save()
          .then((result) => {
            if(role=="DRIVER"){
              Driver.countDocuments()
              .then((result)=>{
                console.log(`Number of documents:`, result);
                result+=1;
                companyCode = "NCTP02"+(result).toString();
                console.log(`Unique Code : ${companyCode}`)
                const driver = new Driver({
                  user,
                  userCode: companyCode,
                })
          
                driver.save();

                user.userCode = driver.userCode;
                user.save()
              })
              .catch((error)=>{
                console.log(`Error from count function: ${error}`);
              })
            }
            else if(role=="MANAGER"){
              Manager.countDocuments()
              .then((result)=>{
                console.log(`Number of documents:`, result);
                companyCode = "NCTP01"+toString(result+1);
              })
              .catch((error)=>{
                console.log(`Error from count function: ${error}`);
              });

              const manager = new Manager({
                userCode: employeeCode,
                user
              });

              manager.save();

              user.userCode = manager.userCode;
              user.save();
            }
            else if(role=="DELIVERY BOY"){
              DeliveryBoy.countDocuments()
              .then((result)=>{
                console.log(`Number of documents:`, result);
                companyCode = "NCTP03"+toString(result);
              })
              .catch((error)=>{
                console.log(`Error from count function: ${error}`);
              })

              const deliveryBoy = new DeliveryBoy({
                userCode:companyCode,
                user
              })

              deliveryBoy.save();

              user.userCode = deliveryBoy.userCode();
              deliveryBoy.save();
            }



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
  
          // console.log(user);
        }
      })
      .catch((err) => {
        res.status(404).json({
          message: `No User found with this emailId`,
          error: `${err}`,
        });
      });
};


exports.registerDriver = (req, res) => {
  var {userCode, address, city, state, age, drivingLicenseType, drivingLicenseExpireDate, secondaryContact, bloodGroup} = req.body;

  Driver.updateOne({userCode}, {
    address, 
    city,
    state,
    age, 
    drivingLicenseType,
    drivingLicenseExpireDate,
    secondaryContact,
    bloodGroup
  }, (err, result)=>{
    if(err){
      res.status(500).json({
        error:`${err}`
      })
    }

    if(res==null){
      res.status(404).json({
        message:"No driver profile found with this userCode"
      })
    }

    res.status(200).json({
      message:"Fields Updated for driver profile"
    })
  });
  
};
  
  
exports.registerManager = (req, res)=>{
  var {userCode, joinDate, secondaryContact, emergencyContact, bloodGroup} = req.body;

  Manager.updateOne({userCode}, {
    joinDate,
    secondaryContact,
    emergencyContact,
    bloodGroup
  }, (err, result)=>{
    if(err){
      res.status(500).json({
        error:`${err}`
      })
    }

    if(res==null){
      res.status(404).json({
        message:"No driver profile found with this userCode"
      })
    }

    res.status(200).json({
      message:"Fields Updated for driver profile"
    })
  });
};
  
  
exports.registerDeliveryBoy = (req, res)=>{
  var {emailId, address, city, state, age, secondaryContact, emergencyContact, bloodGroup} = req.body;

  DeliveryBoy.updateOne({userCode}, {
    address, 
    city,
    state,
    age, 
    secondaryContact,
    emergencyContact,
    bloodGroup
  }, (err, result)=>{
    if(err){
      res.status(500).json({
        error:`${err}`
      })
    }

    if(res==null){
      res.status(404).json({
        message:"No driver profile found with this userCode"
      })
    }

    res.status(200).json({
      message:"Fields Updated for driver profile"
    })
  });
};

// Controller to ckeck if user has registered.
exports.loginUser_checkUser = (req,res,next) => {
	const emailIdOrContact = req.body.emailIdOrContact;
	
	// Regular Expression to detect a email id.
	const emailId_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	// If user entered the email id
	if(emailIdOrContact.match(emailId_regex)){
		User.findOne({
		  emailId: emailIdOrContact,
		})
		.then((user) => {
			  if (!user) {
				return res.status(400).json({
          			message: "This email is not registered",
        		});
			  }
		      next();
		})
		.catch((err)=>{
			 return res.status(500).json({
          			message: "An error caught while finding the user",
        		});
		});
	}else{
		User.findOne({
		  contact: emailIdOrContact,
		})
		.then((user) => {
			  if (!user) {
				return res.status(400).json({
          			message: "This contact number is not registered",
        		});
			  }
		      next();
		})
		.catch((err)=>{
			  return res.status(500).json({
          			message: "An error caught while finding the user",
        		});
		});
	}
};

// Controller to verify otp and login user.
exports.loginUser_verifyOtp = (req, res,next) => {
  passport.authenticate("local", (err,user,info)=>{
    if(err){
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
  })(req, res,next);
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
