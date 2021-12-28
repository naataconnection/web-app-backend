// const fs = require("fs");
// const User = require("../models/user");
// const Driver = require("../models/driver");
// const DeliveryBoy = require("../models/deliveryBoy");
// const Customer = require("../models/customer");
// const Manager = require("../models/manager");
// const SuperUsers = require("../models/superUser");
// const OwnerFleetHunt = require("../models/ownerFleetHunt");
// const OTP = require("../models/otp");
// const Diesel = require("../models/dieselDetails");
// const Vehicle = require("../models/vehicle");
// const Invoice = require("../models/invoice");
// const Notification = require("../models/notification");
// const UserStat = require("../models/userStat");
// const Attendance = require("../models/attendance");
// const Order = require("../models/order");
// const ServiceRequest = require("../models/serviceRequest");
// const GenericContact = require("../models/genericContact");
// const VendorContact = require("../models/vendorContact");
// const uploadFile = require("../utils/gCloud").uploadFile;

// const getFile = async (fileName, content) => {
//   return new Promise((resolve, reject) => {
//     return fs.writeFile( __dirname + "/../../public/db/" + fileName, content, (err) => {
//         if (err) {
//             console.log("An error occured while writing JSON Object to" + `${fileName}`);
//             console.log(err);
//             resolve(false);
//         }
//         console.log("JSON " + `${fileName}` + " has been saved.");
//         resolve(true);
//     });
//   });
// };

// const uploadDB = async (fileName) => {
//     const localDestFilePath = __dirname + "/../../public/db/" + fileName;
//     const filedestPath = "db/" + fileName;
//     let fileUrl = uploadFile(localDestFilePath, filedestPath);
//     fileUrl = await Promise.all([fileUrl]);
//     fs.unlinkSync(localDestFilePath);
//     return fileUrl[0];
// } 


// module.exports.exportDB = async (req, res, next) => {
//   try {
//     var users = await User.find();
//     var drivers = await Driver.find();
//     var deliveryBoys = await DeliveryBoy.find();
//     var managers = await Manager.find();
//     var customers = await Customer.find();
//     var superusers = await SuperUsers.find();
//     var otp = await OTP.find();
//     var diesels = await Diesel.find();
//     var vehicles = await Vehicle.find();
//     var invoices = await Invoice.find();
//     var notifications = await Notification.find();
//     var attendaces = await Attendance.find();
//     var ownerFleetHunt = await OwnerFleetHunt.find();
//     var order = await Order.find();
//     var serviceRequest = await ServiceRequest.find();
//     var genericContact = await GenericContact.find();
//     var vendorContact = await VendorContact.find();
//     var userStat = await UserStat.find();

//     var list = [users, drivers, deliveryBoys, managers, customers, superusers, otp, diesels, vehicles, invoices, 
//         notifications, attendaces, ownerFleetHunt, order, serviceRequest, genericContact, vendorContact, userStat];

//     var fileNames = ["users.json", "drivers.json", "deliveryBoys.json", "managers.json", "customers.json", "superUsers.json",
//     "otp.json", "diesels.json", "vehicles.json", "invoices.json", "notifications.json", "attendances.json",
//     "ownerFleetHunt.json", "order.json", "serviceRequest.json", "genericContact.json", "vendorContact.json", "userStat.json"];    

//     var urls = [];
//     for(let i = 0;i < list.length; i++){
//         list[i] = JSON.stringify(list[i]);
//         list[i] = getFile(fileNames[i], list[i]);
//         list[i] = await Promise.all([list[i]]);
//         const url = await uploadDB(fileNames[i]);
//         urls.push(url);
//     }

//     return res.status(200).json({success: "true", urls: urls});

//   }catch (error) {
//     console.log(error);
//     return res.status(400).json({ success: "false", error: `${error}` });
//   }
// };

const { exec } = require("child_process");
const uploadFile = require("../utils/gCloud").uploadFile;
var path = require('path');

module.exports.db = (req, res) => {
  exec("mongodump", async(error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return res.status(400).json({ success: "false", error: `${error}`});
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    var jsonPath = path.join(__dirname, '..', '..', 'dump', 'testDB');
    // const location = __dirname + "/../../dump/testDB";
    const fileName = "exportDB"
    const filedestPath = "db/" + fileName;
    let fileUrl = uploadFile(jsonPath, filedestPath);
    fileUrl = await Promise.all([fileUrl]);
    return res.status(200).json({ success: "true", message: "Command executed", url: fileUrl[0]});
  });  
  
}
