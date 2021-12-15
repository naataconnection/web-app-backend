const ServiceRequest = require("../models/serviceRequest");
const { paddingZero } = require("../helpers/paddingZeros");
const Customer = require("../models/customer");
const SuperUser = require("../models/superUser");
const Order = require("../models/order");
const Manager = require("../models/manager");
const Invoice = require("../models/invoice");
const Driver = require("../models/driver");
const Vehicle = require("../models/driver");
const DeliveryBoy = require("../models/deliveryBoy");

exports.getServiceRequest = async (req, res) => {
  ServiceRequest.find({}, (err, requests) => {
    if (err) {
      res.status(400).json({ success: "false", error: `${err}` });
    } else {
      res.status(200).send({ success: "true", data: requests });
    }
  });
};

exports.createRequestBySuperUser = async (req, res) => {
  var { customerCode, status, superUserCode, isRecurring, frequency } =
    req.body;

  var customer;
  try {
    customer = await Customer.findOne({ userCode: customerCode });

    if (customer == null) {
      res.status(404).json({
        message: "No Customer found for this customer code.",
      });
    }
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  var superUser;
  try {
    superUser = await SuperUser.findOne({ userCode: superUserCode });

    if (superUser == null) {
      res.status(404).json({
        message: "No Super User found for this superuser code",
      });
    }
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  const result = await ServiceRequest.countDocuments();
  const requestCode = "NCSR/" + paddingZero(result + 1, 4);

  const serviceRequest = new ServiceRequest({
    requestCode,
    customer,
    superUser,
    isRecurring,
    frequency,
    status,
  });

  try {
    await serviceRequest.save();
  } catch (err) {
    res.status(400).json({
      message: "Wrong Details Provided",
      error: `${err}`,
    });
  }

  res.status(200).json({
    message: "Service Request Created Successfully",
  });
};

exports.createRequestByCustomer = async (req, res) => {
  var { customerCode, isRecurring, frequency } = req.body;

  var customer;
  try {
    customer = await Customer.findOne({ userCode: customerCode });

    if (customer == null) {
      res.status(404).json({
        message: "No Customer found for this customer code.",
      });
    }
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  const result = await ServiceRequest.countDocuments();
  const requestCode = "NCSR/" + paddingZero(result + 1, 4);

  const serviceRequest = new ServiceRequest({
    requestCode,
    customer,
    isRecurring,
    frequency,
    status: 1,
  });

  try {
    await serviceRequest.save();
  } catch (err) {
    res.status(400).json({
      message: "Wrong Details Provided",
      error: `${err}`,
    });
  }

  res.status(200).json({
    message: "Service Request Created Successfully",
  });
};

exports.approveRequest = async (req, res) => {
  var { requestCode, superUserCode } = req.body;

  var serviceRequest;
  try {
    serviceRequest = await ServiceRequest.findOne({ requestCode });

    if (serviceRequest == null) {
      res.status(400).json({
        message: "No Service Request found for this request code",
      });
    }
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  if (serviceRequest.status >= 2) {
    res.status(200).json({
      message: "Request is already approved",
    });
  }

  var superUser;
  try {
    superUser = await SuperUser.findOne({ userCode: superUserCode });

    if (superUser == null) {
      res.status(400).json({
        message: "No Super User found for this code",
      });
    }
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  console.log("Service Request SuperUser", serviceRequest.superUser);
  console.log("Super User from request", superUser._id);

  if (!serviceRequest.superUser.equals(superUser._id)) {
    res.status(400).json({
      message: `Given super user has not created this request`,
    });
  }

  serviceRequest.status = 2;

  try {
    await serviceRequest.save();
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  res.status(200).json({
    message: "Service Request approved",
  });
};

exports.assignManager = async (req, res) => {
  const { requestCode, managerCode, superUserCode } = req.body;

  var serviceRequest;

  try {
    serviceRequest = await ServiceRequest.findOne({ requestCode });

    if (serviceRequest == null) {
      res.status(404).json({
        message: "No Service Request found for this request code",
      });
    }
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  if (serviceRequest.status == 0 || serviceRequest.status == 1) {
    res.status(400).json({
      message: "Service Reuqest is unapporved or pending",
    });
  }

  var superUser;

  try {
    superUser = await SuperUser.findOne({ userCode: superUserCode });

    if (superUser == null) {
      res.status(400).json({
        message: `No SuperUser found for this superuser code`,
      });
    }
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  if (!serviceRequest.superUser.equals(superUser._id)) {
    res.status(401).json({
      message: `Given superUser is not authorized for this service request`,
    });
  }

  var manager;

  try {
    manager = await Manager.findOne({ userCode: managerCode });

    if (manager == null) {
      res.status(404).json({
        message: "No Manager found for this manager code",
      });
    }
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  serviceRequest.manager = manager;
  serviceRequest.status = 3;

  try {
    await serviceRequest.save();
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  res.status(200).json({
    message: "Manager has been assigned to service request",
  });
};

exports.assignDriversAndDB = async (req, res) => {
  var { driverCodes, vehicleCodes, requestCode, deliveryBoyCodes } = req.body;

  var serviceRequest;

  try {
    serviceRequest = await ServiceRequest.findOne({ requestCode });

    if (serviceRequest == null) {
      res.status(400).json({
        message: `No service request found for this request code`,
      });
    }
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  var n = driverCodes.length;
  var drivers = [];
  var vehicles = [];
  var deliveryBoys = [];

  for (var i = 0; i < n; i++) {
    var driver;

    try {
      driver = await Driver.findOne({ userCode: driverCodes[i] });

      if (driver == null) {
        res.status(400).json({
          message: `No driver found for this drivercode - ${driverCodes[i]} `,
        });
      }
    } catch (err) {
      res.status(400).json({
        error: `${err}`,
      });
    }

    var vehicle;

    try {
      vehicle = await Vehicle.findOne({ vehicleCode: vehicleCodes[i] });

      if (vehicle == null) {
        res.status(400).json({
          message: `No vehicle found for this vehiclecode - ${vehicleCodes[i]}`,
        });
      }
    } catch (err) {
      res.status(400).json({
        error: `${err}`,
      });
    }

    var deliveryBoy;

    try {
      deliveryBoy = await DeliveryBoy.findOne({
        userCode: deliveryBoyCodes[i],
      });

      if (deliveryBoy == null) {
        res.status(400).json({
          message: `No delivery boy found for this delivery boy code - ${deliveryBoyCodes[i]}`,
        });
      }
    } catch (err) {
      res.status(400).json({
        error: `${err}`,
      });
    }

    driver.vehicle = vehicle;
    driver.deliveryBoy = deliveryBoy;

    try {
      await driver.save();
    } catch (err) {
      res.status(400).json({
        error: `${err}`,
      });
    }
    drivers.push(driver);
    vehicles.push(vehicle);
    deliveryBoys.push(deliveryBoy);
  }

  serviceRequest.drivers = drivers;
  serviceRequest.vehicles = vehicles;
  serviceRequest.deliveryBoys = deliveryBoys;
  serviceRequest.status = 4;

  try {
    await serviceRequest.save();
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  res.status(200).json({
    message: "Drivers, Delivery Boys and Vehicles assigned to Service Request",
  });
};

exports.createOrder = async (req, res) => {
  var { requestCode, driverCode, deliverySheetId, startingKM } = req.body;

  var serviceRequest;
  try {
    serviceRequest = await ServiceRequest.findOne({ requestCode });

    if (serviceRequest == null) {
      res.status(400).json({
        message: "No Service Request found for this request code",
      });
    }
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  var driver;
  try {
    driver = await Driver.findOne({ userCode: driverCode });

    if (driver == null) {
      res.status(400).json({
        message: `No driver found wih this driver code`,
      });
    }
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  const base = requestCode.slice(-4);
  var n;
  if (serviceRequest.orders == null) {
    n = 0;
  } else {
    n = serviceRequest.orders.length;
  }

  const orderCode = "NCOR/" + base + "/" + paddingZero(n + 1, 2);

  const order = new Order({
    driver,
    orderCode,
    deliverySheetId,
    startingKM,
  });

  try {
    await order.save();
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  serviceRequest.orders.push(order);

  try {
    await serviceRequest.save();
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  res.status(200).json({
    message: `Order created for requestCode - ${requestCode}`,
  });
};

exports.createInvoice = async (req, res) => {
  var {
    orderCode,
    invoiceId,
    numberParcels,
    parcelWeight,
    deliveryAddress,
    parcelType,
  } = req.body;

  var order;
  try {
    order = await Order.findOne({ orderCode });

    if (order == null) {
      res.status(400).json({
        message: `No Order found for this orderCode`,
      });
    }
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  var n = order.invoices.length;
  const orderCodeSplit = orderCode.split("/");
  // console.log(orderCodeSplit[0]);
  // console.log(orderCodeSplit[1]);
  const invoiceCode =
    "NCIC/" +
    orderCodeSplit[1] +
    "/" +
    orderCodeSplit[2] +
    "/" +
    paddingZero(n + 1, 2);

  const invoice = new Invoice({
    invoiceCode,
    invoiceId,
    numberParcels,
    parcelWeight,
    deliveryAddress,
    parcelType,
  });

  try {
    await invoice.save();
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  order.invoices.push(invoice);

  try {
    await order.save();
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  res.status(200).json({
    message: `Invoice Created for orderCode - ${orderCode}`,
  });
};

exports.dispatchedDriver = async (req, res) => {
  var { driverCode, orderCode, requestCode } = req.body;

  var order;
  try {
    order = await Order.findOne({ orderCode: orderCode });
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  var driver;
  try {
    driver = await Driver.findOne({ userCode: driverCode });

    if (driver == null) {
      res.status(400).json({
        message: `No driver found wih this driver code`,
      });
    }
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  if (!order.driver.equals(driver._id)) {
    res.status(400).json({
      message: `Driver who intiated the request is not same as given driver`,
    });
  }

  var serviceRequest;
  try {
    serviceRequest = await ServiceRequest.findOne({ requestCode: requestCode });
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  order.dispatch = true;

  try {
    await order.save();
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  var n = serviceRequest.orders.length;

  var allDispatched = true;

  for (var i = 0; i < n; i++) {
    if (serviceRequest.orders[i].dispatched == false) {
      allDispatched = false;
      break;
    }
  }

  if (allDispatched == true) {
    serviceRequest.status = 5;
  }

  try {
    await serviceRequest.save();
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  res.status(200).json({
    message: `Order updated to dispatch`,
  });
};

exports.deliverDriver = async (req, res) => {
  var { driverCode, orderCode, requestCode } = req.body;

  var order;
  try {
    order = await Order.findOne({ orderCode: orderCode });
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  var driver;
  try {
    driver = await Driver.findOne({ userCode: driverCode });

    if (driver == null) {
      res.status(400).json({
        message: `No driver found wih this driver code`,
      });
    }
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  if (!order.driver.equals(driver._id)) {
    res.status(400).json({
      message: `Driver who intiated the request is not same as given driver`,
    });
  }

  var serviceRequest;
  try {
    serviceRequest = await ServiceRequest.findOne({ requestCode: requestCode });
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  order.deliver = true;

  try {
    await order.save();
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  var n = serviceRequest.orders.length;

  var allDelivered = true;

  for (var i = 0; i < n; i++) {
    if (serviceRequest.orders[i].dispatched == false) {
      allDelivered = false;
      break;
    }
  }

  if (allDelivered == true) {
    serviceRequest.status = 6;
  }

  try {
    await serviceRequest.save();
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  res.status(200).json({
    message: `Order updated to delivered`,
  });
};

exports.closeRequest = async (req, res) => {
  var { managerCode, requestCode } = req.body;

  var manager;
  try {
    manager = Manager.findOne({ userCode: managerCode });

    if (manager == null) {
      res.status(400).json({
        message: `No manager found for this manager code`,
      });
    }
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  var serviceRequest;
  try {
    serviceRequest = ServiceRequest.findOne({ requestCode: requestCode });

    if (serviceRequest == null) {
      res.status(400).json({
        message: `No service request found for this requestCode`,
      });
    }
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }

  if (serviceRequest.manager != manager) {
    res.status(400).json({
      message: `Given managerCode is not corresponding to manager of service request`,
    });
  }

  serviceRequest.status = 7;

  try {
    await serviceRequest.save();
  } catch (err) {
    res.status(400).json({
      error: `${err}`,
    });
  }
};

module.exports.getPendingServiceRequest = async (req, res) => {
  try {
    const users = await ServiceRequest.find({userCode: req.body.userCode, status: 1});
    res.status(200).send({success: "true", message: users});
  }catch (error) {
    console.log(error);
    res.status(400).json({ success: "false", error: `${error}` });
  }
}

module.exports.getCompletedServiceRequest = async (req, res) => {
  try {
    const users = await ServiceRequest.find({userCode: req.body.userCode, status: 7});
    res.status(200).send({success: "true", message: users});
  }catch (error) {
    console.log(error);
    res.status(400).json({ success: "false", error: `${error}` });
  }
}

module.exports.getActiveServiceRequest = async (req, res) => {
  try {
    const users = await ServiceRequest.find({userCode: req.body.userCode, status: { $ne: 0}, status: { $ne: 1}, status: { $ne: 7}});
    res.status(200).send({success: "true", message: users});
  }catch (error) {
    console.log(error);
    res.status(400).json({ success: "false", error: `${error}` });
  }
}
