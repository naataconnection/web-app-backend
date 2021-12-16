const Customer = require("../models/customer");
const SuperUser = require("../models/superUser");
const Order = require("../models/order");
const Manager = require("../models/manager");
const Driver = require("../models/driver");
const Vehicle = require("../models/vehicle");
const DeliveryBoy = require("../models/deliveryBoy");

const getUserCodefromObjectId = async (array) => {
    if(array[0]){
        for(let i = 0;i < array.length; i++){
            const customer = await Customer.findOne({_id: array[i].customer}).select({"userCode": 1});
            const manager = await Manager.findOne({_id: array[i].manager}).select({"userCode": 1});
            const superUser = await SuperUser.findOne({_id: array[i].superUser}).select({"userCode": 1});
  
            var orders = [];
            if(array[i].orders[0]){
              for(let j = 0;j < array[i].orders.length; j++){
                const orderCode = await Order.findOne({_id: array[i].orders[j]}).select({"orderCode": 1});
                orders.push(orderCode);
              }
            }
  
            var deliveryBoys = [];
            if(array[i].deliveryBoys[0]){
              for(let j = 0;j < array[i].deliveryBoys.length; j++){
                const userCode = await DeliveryBoy.findOne({_id: array[i].deliveryBoys[j]}).select({"userCode": 1});
                deliveryBoys.push(userCode);
              }
            }
  
            var vehicles = [];
            if(array[i].vehicles[0]){
              for(let j = 0;j < array[i].vehicles.length; j++){
                const userCode = await Vehicle.findOne({_id: array[i].vehicles[j]}).select({"userCode": 1});
                vehicles.push(userCode);
              }
            }
  
            var drivers = [];
            if(array[i].drivers[0]){
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

module.exports = {
    getUserCodefromObjectId
}