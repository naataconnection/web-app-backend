const ServiceRequest = require("../models/serviceRequest");
const {paddingZero} = require("../helpers/paddingZeros");
const Customer = require("../models/customer");
const SuperUser = require("../models/superUser");
const Order = require("../models/order");
const Manager = require("../models/manager");
const Invoice = require("../models/invoice");


exports.createRequest = async (req, res)=>{
    var {customerCode, isApproved, superUserCode, isRecurring, frequency, remark, totalParcels, invoicesData} = req.body;

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

    var n = invoicesData.length;
    var invoices;
    for(var i=0;i<n;i++){
        var invoice = new Invoice({
            invoiceCode: invoicesData[i].invoiceCode,
            numberParcels: invoicesData[i].numberParcels,
            parcelType: invoicesData[i].parcelType,
        });

        try{
            await invoice.save();
        }
        catch(err){
            res.status(400).json({
                error:`${err}`
            })
        }

        invoices.push(invoice);
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
    const {requestCode, managerCode, superUserCode} = req.body;

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

    var superUser;

    try{
        superUser = await SuperUser.findOne({userCode:superUserCode});

        if(superUser==null){
            res.status(400).json({
                message:`No SuperUser found for this superuser code`
            })
        }
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    if(serviceRequest.superUser!=superUser){
        res.status(401).json({
            message:`Given superUser is not authorized for this service request`
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

exports.assignDriversAndDB = async (req, res)=>{
    var {driverCodes, vehicleCodes, requestCode, deliveryBoyCodes} = req.body;

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
    var deliveryBoys = [];

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

        var deliveryBoy;

        try{
            deliveryBoy = await deliveryBoy.findOne({userCode: deliveryBoyCodes[i]});

            if(deliveryBoy==null){
                res.status(400).json({
                    message:`No delivery boy found for this delivery boy code - ${deliveryBoyCodes[i]}`
                })
            }
        }
        catch(err){
            res.status(400).json({
                error:`${err}`
            })
        }

        driver.vehicle = vehicle;
        driver.deliveryBoy = deliveryBoy;

        drivers.push(driver);
        vehicles.push(vehicle);
        deliveryBoys.push(deliveryBoy);
    }

    serviceRequest.drivers = drivers;
    serviceRequest.vehicles = vehicles;
    serviceRequest.deliveryBoys = deliveryBoys;
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
        message:"Drivers, Delivery Boys and Vehicles assigned to Service Request"
    })
};

exports.assignDriverToInvoice = async (req, res)=>{
    var {driverCode, invoiceCode} = req.body;

    var driver;
    try{
        driver = await Driver.findOne({userCode: driverCode});

        if(driverCode==null){
            res.status(400).json({
                message:`No driver found for this driver code`
            })
        }
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    var invoice;
    try{
        invoice = await Invoice.findOne({invoiceCode: invoiceCode});

        if(invoice==null){
            res.status(400).json({
                message:`No Invoice found for this invoiceCode`
            })
        }
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    invoice.driver = driver;

    try{
        await invoice.save();
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    res.status(200).json({
        message:`Invoice Updated to dispatched`
    })
};

exports.dispatchedDriver  = async(req, res)=>{
    var {driverCode, invoiceCode, orderCode} = req.body;

    var driver;
    try{
        driver = await Driver.findOne({userCode:driverCode});

        if(driver==null){
            res.status(400).json({
                message: `No driver found wih this driver code`
            })
        }
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    var invoice;
    try{
        invoice = await Invoice.findOne({invoiceCode: invoiceCode});

        if(invoice==null){
            res.status(400).json({
                message:`No invoice found for this invoice code`
            })
        }
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    if(invoice.driver!=driver){
        res.status(400).json({
            message:`Driver with code - ${driverCode} is not assigned to this invoice`
        })
    }

    invoice.dispatched = true;



    var order;
    try{
        order = await Order.findOne({orderCode:orderCode});
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    var invoices = order.invoices;
    var n = invoices.length;
    var allDispatched = true;

    for(var i=0;i<n;i++){
        if(invoices[i].driver==null){
            allDispatched = false;
            break;
        }
    }

    if(allDispatched==true){
        order.status = 5;
    }

    try{
        await order.save();
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    res.status(200).json({
        message:`Invoice updated to dispatch for invoice Code - ${invoiceCode}`
    })
};

exports.deliveredDriver  = async(req, res)=>{
    var {driverCode, invoiceCode, orderCode} = req.body;

    var driver;
    try{
        driver = await Driver.findOne({userCode:driverCode});

        if(driver==null){
            res.status(400).json({
                message: `No driver found wih this driver code`
            })
        }
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    var invoice;
    try{
        invoice = await Invoice.findOne({invoiceCode: invoiceCode});

        if(invoice==null){
            res.status(400).json({
                message:`No invoice found for this invoice code`
            })
        }
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    if(invoice.driver!=driver){
        res.status(400).json({
            message:`Driver with code - ${driverCode} is not assigned to this invoice`
        })
    }

    invoice.dispatched = true;



    var order;
    try{
        order = await Order.findOne({orderCode:orderCode});
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    var invoices = order.invoices;
    var n = invoices.length;
    var allDelivered = true;

    for(var i=0;i<n;i++){
        if(invoices[i].driver==null){
            allDelivered = false;
            break;
        }
    }

    if(allDelivered==true){
        order.status = 5;
    }

    try{
        await order.save();
    }
    catch(err){
        res.status(400).json({
            error:`${err}`
        })
    }

    res.status(200).json({
        message:`Invoice updated to dispatch for invoice Code - ${invoiceCode}`
    })
};