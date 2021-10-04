const ServiceRequest = require("../models/serviceRequest");
const {paddingZero} = require("../helpers/paddingZeros");
const Customer = require("../models/customer");
const SuperUser = require("../models/superUser");
const Order = require("../models/order");
const Manager = require("../models/manager");


exports.createRequest = async (req, res)=>{
    var {customerCode, isApproved, superUserCode, isRecurring, frequency, remark, totalParcels, invoices} = req.body;

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
        res.status(400).json({
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
        res.status(400).json({
            error:`${err}`
        })
    }
    


    const result = await ServiceRequest.countDocuments()
    const requestCode = "NCREQ"+paddingZero(result+1, 4);
    const orderCode = "NCORD"+paddingZero(result+1, 0);

    var remarks = [];
    remarks.push(remark);

    const serviceRequest = new ServiceRequest({
        requestCode,
        customer,
        superUser,
        isRecurring,
        frequency,
        status: isApproved
    })

    try{
        await serviceRequest.save();
    }
    catch(err){
        res.status(400).json({
            message: "Wrong Details Provided",
            error:`${err}`
        })
    }

    const order = new Order({
        orderCode,
        serviceRequest,
        totalParcels,
        invoices
    });

    try{
        await order.save();
    }
    catch(err){
        res.status(400).json({
            message:"Wrong Details provided",
            error:`${err}`
        })
    }

    res.status(200).json({
        message:"Service Request Created Successfully"
    })
};

exports.approveRequest = async (req, res) =>{
    var {requestCode, superUserCode} = req.body;

    var serviceRequest;
    try{
        serviceRequest = await ServiceRequest.findOne({requestCode});

        if(serviceRequest==null){
            res.status(400).json({
                message:"No Service Request found for this request code"
            })
        }
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    if(serviceRequest.status>=2){
        res.status(200).json({
            message:"Request is already approved"
        })
    }

    var superUser;
    try{
        superUser = await SuperUser.findOne({userCode: superUserCode});

        if(superUser==null){
            res.status(400).json({
                message:"No Super User found for this code"
            })
        }
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    serviceRequest.superUser = superUser;
    serviceRequest.status = 2;

    try{
        await serviceRequest.save();
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    res.status(200).json({
        message:"Service Request approved"
    })
};

exports.assignManager = async (req, res)=>{
    const {requestCode, managerCode} = req.body;

    var serviceRequest;

    try{
        serviceRequest = await ServiceRequest.findOne({requestCode});

        if(serviceRequest==null){
            res.status(404).json({
                message:"No Service Request found for this request code"
            })
        }
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    if(serviceRequest.status==0||serviceRequest.status==1){
        res.status(400).json({
            message:"Service Reuqest is unapporved or pending"
        })
    }

    var manager;

    try{
        manager = await Manager.findOne({userCode:managerCode});

        if(manager==null){
            res.status(404).json({
                message:"No Manager found for this manager code"
            })
        }
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    serviceRequest.manager = manager;
    serviceRequest.status=3;

    try{
        await serviceRequest.save();
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    res.status(200).json({
        message:"Manager has been assigned to service request",
    });

};

exports.assignDrivers = async (req, res)=>{
    var {driverCodes, vehicleCodes, requestCode} = req.body;

    var serviceRequest;

    try{
        serviceRequest = await ServiceRequest.findOne({requestCode});

        if(serviceRequest==null){
            res.status(400).json({
                message:`No service request found for this request code`
            })
        }
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    var n = driverCodes.size();
    var drivers = [];
    var vehicles = [];

    for(var i=0;i<n;i++){
        var driver;

        try{
            driver = await Driver.findOne({userCode:driverCodes[i]});

            if(driver==null){
                res.status(400).json({
                    message:`No driver found for this drivercode - ${driverCodes[i]} `
                })
            }
        }
        catch(err){
            res.status(400).json({
                error:`${err}`
            })
        }

        var vehicle;

        try{
            vehicle = await vehicle.findOne({vehicleCode:vehicleCodes[i]});

            if(vehicle==null){
                res.status(400).json({
                    message:`No vehicle found for this vehiclecode - ${vehicleCodes[i]}`
                })
            }
        }
        catch(err){
            res.status(400).json({
                error:`${err}`
            })
        }

        vehicle.driver = driver;

        drivers.push(driver);
        vehicles.push(vehicle);
    }

    serviceRequest.drivers = drivers;
    serviceRequest.vehicles = vehicles;
    serviceRequest.status = 4;

    try{
        await serviceRequest.save();
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    res.status(200).json({
        message:"Drivers and Vehicles assigned to Service Request"
    })
};

exports.assignDeliveryBoys = async (req, res)=>{
    var {deliveryBoyCodes, requestCode} = req.body;

    var serviceRequest;

    try{
        serviceRequest = await ServiceRequest.findOne({requestCode});

        if(serviceRequest==null){
            res.status(400).json({
                message:`No service request found for this request code`
            })
        }
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    var n = deliveryBoysCodes.length;
    var deliveryBoys = [];

    for(var i=0;i<n;i++){
        var deliveryBoy;

        try{
            deliveryBoy = await deliveryBoy.findOne({userCode:deliveryBoyCodes[i]});

            if(deliveryBoy==null){
                res.status.json({
                    message:`No delivery boy found for this userCode - ${deliveryBoyCodes[i]}`
                })
            }
        }
        catch(err){
            res.status(400).json({
                error:`${err}`
            })
        }
        deliveryBoys.push(deliveryBoy);
    }

    serviceRequest.deliveryBoys = deliveryBoys;
    serviceRequest.status = 7;

    try{
        await serviceRequest.save();
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    res.status(200).json({
        message:`Delivery Boys Assigned to service request`
    })
};