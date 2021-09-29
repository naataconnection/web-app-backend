require("dotenv").config();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");
const Driver = require("../models/driver");
const Manager = require("../models/manager");
const DeliveryBoy = require("../models/deliveryBoy");


// Controller to register a user.
exports.registerUser = (req, res) => {
var { firstName, middleName, lastName, emailId, contact, employeeCode} = req.body;

  if (!firstName || !emailId || !employeeCode || !contact) {
    res.status(409).json({
      message: "Required fields are not present.",
    });
  }

  employeeCode = employeeCode.toUpperCase();

  if(employeeCode.slice(0,2)!="NC"){
    res.status(500).json({
        message: "Invalid Employee Code"
    })
  }

  if(employeeCode.slice(2,4)!="TP"){
    res.status(500).json({
        message: "Not an Employee Code"
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
          emailId,
          contact,
          employeeCode
        });

        user.save()
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

        // bcrypt.genSalt(10, (err, salt) => {
        //   if (err) {
        //     // console.log(err);
        //     return res.status(500).json({
        //       message: `${err}`,
        //     });
        //   }
        //   bcrypt.hash(user.password, salt, (err, hash) => {
        //     if (err) {
        //       // console.log(err);
        //       return res.status(500).json({
        //         message: `${err}`,
        //       });
        //     }
        //     user.password = hash;
        //     user
        //       .save()
        //       .then((result) => {
        //         return res.status(200).json({
        //           message: `User Registraion Successful`,
        //         });
        //       })
        //      .catch((err) => {
        //         res.status(500).json({
        //           message: `Incorrect Data Provided`,
        //           error: `${err}`,
        //         });
        //       });
        //   });
        // });

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
//
exports.registerDriver = (req, res) => {
  console.log(User.count({}))

  var {address, city, state, age, drivingLicenseType, drivingLicenseExpireDate, secondaryContact, bloodGroup, employeeCode} = req.body;

  employeeCode = employeeCode.toUpperCase();

  if(employeeCode.slice(2,4)!="TP"){
    res.status(500).json({
      message: "employeeCode is not corresponding to employee"
    })
  }

  if(employeeCode.slice(4,6)!="02"){
    res.status(500).json({
      message: "employeeCode is not corresponding to driver"
    })
  }

  Driver.find({employeeID:employeeCode})
  .then((result)=>{
    const driver = result;

    if(driver.length!=0){
      res.status(500).json({
        message:"Driver already exists with this employeeCode"
      })
    }
  })
  .catch((err)=>{
    res.status(500).json({
      error:`${err}`
    })
  });



  User.findOne({employeeCode:employeeCode})
    .then((result)=>{
      const user = result;

      if(result==null){
        res.status(404).json({
          message:"No User found with this employeeCode"
        })
      }

      const driver = new Driver({
        user:user,
        address,
        city,
        state,
        age,
        drivingLicenseType,
        drivingLicenseExpireDate,
        secondaryContact,
        bloodGroup,
        employeeID: employeeCode
      });

      driver.save()
      .then((result)=>{
        res.status(200).json({
          message:"Driver User created"
        })
      })
      .catch((err)=>{
        res.status(500).json({
          message:"Wrong Details",
          error:`${err}`
        });
      })
    })
    .catch((err)=>{
      res.status(404).json({
        message: "No User with this employeeCode",
        error:`${err}`
      });
    });
};


exports.registerManager = (req, res)=>{
  var {joinDate, secondaryContact, emergencyContact, bloodGroup, employeeCode} = req.body;

  employeeCode = employeeCode.toUpperCase();

  if(employeeCode.slice(2,4)!="TP"){
    res.status(500).json({
      message: "employeeCode is not corresponding to employee"
    })
  }

  if(employeeCode.slice(4,6)!="01"){
    res.status(500).json({
      message: "employeeCode is not corresponding to manager"
    })
  }

  Manager.find({employeeID:employeeCode})
  .then((result)=>{
    const manager = result;

    if(manager.length!=0){
      res.status(500).json({
        message:"Manager already exists with this employeeCode"
      })
    }
  })
  .catch((err)=>{
    res.status(500).json({
      error:`${err}`
    })
  });


  User.findOne({employeeCode: employeeCode})
  .then((result)=>{
    const user = result;

    if(result==null){
      res.status(404).json({
        message:"No User found with this employeeCode"
      })
    }

    const manager = new Manager({
      user,
      joinDate,
      secondaryContact,
      emergencyContact,
      bloodGroup,
      employeeCode
    })

    manager.save()
    .then((result)=>{
      res.status(200).json({
        message:"Manager created"
      })
    })
    .catch((err)=>{
      res.status(500).json({
        error:`${err}`
      })
    })
  })
  .catch((err)=>{
    res.status(500).json({
      error:`${err}`
    })
  })
  
};


exports.registerDeliveryBoy = (req, res)=>{
  var {address, city, state, age, secondaryContact, emergencyContact, bloodGroup, employeeCode} = req.body;

  employeeCode = employeeCode.toUpperCase();

  if(employeeCode.slice(2,4)!="TP"){
    res.status(500).json({
      message: "employeeCode is not corresponding to employee"
    })
  }

  if(employeeCode.slice(4,6)!="03"){
    res.status(500).json({
      message: "employeeCode is not corresponding to delivery boy"
    })
  }


  DeliveryBoy.find({employeeID:employeeCode})
  .then((result)=>{
    const deliveryBoy = result;

    if(deliveryBoy.length!=0){
      res.status(500).json({
        message:"Delivery Boy already exists with this employeeCode"
      })
    }
  })
  .catch((err)=>{
    res.status(500).json({
      error:`${err}`
    })
  });

  User.findOne({employeeCode: employeeCode})
  .then((result)=>{
    const user = result;

    if(user==null){
      res.status(404).json({
        error:"No User found with this employeeCode"
      })
    }

    const deliveryBoy = new DeliveryBoy({
      user,
      address,
      city, 
      state,
      age,
      secondaryContact,
      emergencyContact,
      bloodGroup,
      employeeID:employeeCode
    })

    deliveryBoy.save()
    .then((result)=>{
      res.status(200).json({
        message:"Delivery Boy User created"
      })
    })
    .catch((err)=>{
      res.status(500).json({
        error:`${err}`
      })
    })


  })
  .catch((error)=>{
    res.status(500).json({
      error:`${error}`
    })
  });
};

// Controller to login the user.
exports.loginUser = (req, res, next) => {
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
