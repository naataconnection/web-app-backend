const Invoice = require("../models/invoice");

module.exports.getInvoice = async (req, res) => {
    try{
        const data = await Invoice.find({invoiceCode: req.body.invoiceCode});
        if(!data[0]){
            return res.status(200).send({success: "true", message: "Invoice doesn't exist with this Invoice Code"});
        }
        return res.status(200).send({success: "true", message: data});
    }catch(error){
        return res.status(400).json({ success: "false", error: `${err}`});
    }
}