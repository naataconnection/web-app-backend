const Order = require("../models/order");
const Invoice = require("../models/invoice");
const Driver = require("../models/driver");

module.exports.getOrder = async (req, res) => {
    try{
        const data = await Order.find({orderCode: req.body.orderCode});
        if(data[0]){
            for(let i = 0;i < data.length; i++){

                const driver = await Driver.findOne({_id: data[i].driver}).select({"userCode": 1});

                var invoices = [];
                for(let j = 0;j < data[i].invoices.length; j++){
                    const invoice = await Invoice.findOne({_id: data[i].invoices[j]}).select({"invoiceCode": 1, "invoiceId": 1});
                    invoices.push(invoice);
                }   

                data[i].invoices = invoices;
                data[i].driver = driver;
            }
        }else{
            return res.status(200).send({success: "true", "message": "Order doesn't exist with this OrderCode"});
        }
        return res.status(200).send({success: "true", message: data});
    }catch(error){
        return res.status(400).json({ success: "false", error: `${err}`});
    }
}