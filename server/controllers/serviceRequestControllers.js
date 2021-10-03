const ServiceRequest = require("../models/serviceRequest");
const {paddingZero} = require("../helpers/paddingZeros");
const Customer = require("../models/customer");
const SuperUser = require("../models/superUser");


exports.createRequest = async (req, res)=>{
    var {customerCode, isApproved, superUserCode, isRecurring, frequency, remark} = req.body;

    var customer;
    try{
        customer = await Customer.findOne({userCode: customerCode});
        
        if(customer==null){
            res.status(404).json({
                message:"No Customer found for this customer code."
            })
        }
    }
    catch(err){
        res.status(500).json({
            error: `${err}`
        })
    }

    var superUser;
    try{
        superUser = await SuperUser.findOne({userCode: superUserCode});

        if(superUser==null){
            res.status(404).json({
                message:"No Super User found for this superuser code"
            })
        }
    }  
    catch(err){
        res.status(500).json({
            error:`${err}`
        })
    }
    


    const result = await ServiceRequest.countDocuments()
    const requestCode = "NCREQ"+paddingZero(result+1, 4);

    var remarks = [];
    remarks.push(remark);

    const serviceRequest = new SuperUser({
        requestCode,
        customer,
        superUser,
        isRecurring,
        frequency,
        status: isApproved
    })

    try{
        await serviceRequest.save();

        res.status(200).json({
            message:"Service Request Created"
        })
    }
    catch(err){
        res.status(500).json({
            message: "Wrong Details Provided"
        })
    }
};
