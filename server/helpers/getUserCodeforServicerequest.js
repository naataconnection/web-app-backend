const Customer = require("../models/customer");
const SuperUser = require("../models/superUser");
const Order = require("../models/order");
const Manager = require("../models/manager");
const Driver = require("../models/driver");
const Vehicle = require("../models/vehicle");
const DeliveryBoy = require("../models/deliveryBoy");
const User = require("../models/user");

const getUserCodefromObjectId = async (array) => {
    if(array.length > 0){
        for(let i = 0;i < array.length; i++){
            const customer = await Customer.findOne({_id: array[i].customer}).select({"userCode": 1});
            const manager = await Manager.findOne({_id: array[i].manager}).select({"userCode": 1});
            const superUser = await SuperUser.findOne({_id: array[i].superUser}).select({"userCode": 1, "firstName": 1, "middleName": 1, "lastName": 1});
  
            var orders = [];
            if(array[i].orders.length > 0){
              for(let j = 0;j < array[i].orders.length; j++){
                const orderCode = await Order.findOne({_id: array[i].orders[j]}).select({"orderCode": 1});
                orders.push(orderCode);
              }
            }
  
            var deliveryBoys = [];
            if(array[i].deliveryBoys.length > 0){
              for(let j = 0;j < array[i].deliveryBoys.length; j++){
                const userCode = await DeliveryBoy.findOne({_id: array[i].deliveryBoys[j]}).select({"userCode": 1});
                deliveryBoys.push(userCode);
              }
            }
  
            var vehicles = [];
            if(array[i].vehicles.length > 0){
              for(let j = 0;j < array[i].vehicles.length; j++){
                const userCode = await Vehicle.findOne({_id: array[i].vehicles[j]}).select({"vehicleCode": 1});
                vehicles.push(userCode);
              }
            }
  
            var drivers = [];
            if(array[i].drivers.length > 0){
              for(let j = 0;j < array[i].drivers.length; j++){
                const userCode = await Driver.findOne({_id: array[i].drivers[j]}).select({"userCode": 1});
                drivers.push(userCode);
              }
            }
        
            array[i].customer = customer;
            array[i].manager = manager;
            array[i].superUser = superUser;
            array[i].deliveryBoys = deliveryBoys;
            array[i].drivers = drivers;
            array[i].vehicles = vehicles;
            array[i].orders = orders;
  
        }
      }
      return array;
}

const getName = async (result) =>{

  if(result.length > 0){
    for(let i = 0;i < result.length; i++){
      const customer = await User.findOne({userCode: result[i].customer.userCode}).select({"userCode": 1, "firstName": 1, "middleName": 1, "lastName": 1});
      const manager = await User.findOne({userCode: result[i].manager.userCode}).select({"userCode": 1, "firstName": 1, "middleName": 1, "lastName": 1});
     
      var drivers = [];
      if(result[i].drivers.length > 0){
        for(let j = 0;j < result[i].drivers.length; j++){
          const details = await User.findOne({userCode: result[i].drivers[j].userCode}).select({"userCode": 1, "firstName": 1, "middleName": 1, "lastName": 1});
          drivers.push(details);
        }
      }

      var deliveryBoys = [];
      if(result[i].deliveryBoys.length > 0){
        for(let j = 0;j < result[i].deliveryBoys.length; j++){
          const details = await User.findOne({userCode: result[i].deliveryBoys[j].userCode}).select({"userCode": 1, "firstName": 1, "middleName": 1, "lastName": 1});
          deliveryBoys.push(details);
        }
      }
      
      result[i].customer = customer;
      result[i].manager = manager;
      result[i]["updatedDrivers"] = drivers;
      result[i]["updatedDeliveryBoys"] = deliveryBoys;
    }
  }
  return result;
}

module.exports = {
    getUserCodefromObjectId, 
    getName
}