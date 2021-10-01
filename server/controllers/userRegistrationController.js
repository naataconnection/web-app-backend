require("dotenv").config();
const User = require("../models/user");
const Driver = require("../models/driver");
const DeliveryBoy = require("../models/deliveryBoy");
const Manager = require("../models/manager");
const Customer = require("../models/customer");


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
            else if(role=="CUSTOMER"){
              Customer.countDocuments()
              .then((result)=>{
                console.log(`Number of documents:`, result);
                companyCode = "NCPR01"+toString(result);
              })
              .catch((error)=>{
                console.log(`Error from count function: ${error}`);
              })

              const customer = new DeliveryBoy({
                userCode:companyCode,
                user
              })

              customer.save();

              user.userCode = customer.userCode();
              customer.save();
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

exports.registerCustomer = (req, res)=>{
  var {userCode, companyName, department, address, city, state, secondaryContact, gst} = req.body;

  DeliveryBoy.updateOne({userCode}, {
    companyName,
    department,
    address,
    city,
    state,
    secondaryContact,
    gst
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
}