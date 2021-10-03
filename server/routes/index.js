const express = require("express");
const userAuthRoutes = require("./userAuthRoutes.js");
const superUserAuthRoutes = require("./superUserAuthRoutes.js");
const otpRoutes = require("./otpRoutes.js");
const verificationEmailRoutes = require("./verificationEmailRoutes.js");
const genericContactRoutes = require("./genericContactRoutes.js");
const vendorContactRoutes = require("./vendorContactRoutes.js");
const { authRequired, forwardAuthenticated } = require("../middlewares/authMiddleware.js");
const blockUserRoutes = require("./blockUserRoutes.js");
const serviceRequestRoutes = require("../routes/serviceRequestRoutes.js");
const router = express.Router();

router.use("/user",userAuthRoutes);
router.use("/superUser",superUserAuthRoutes);
router.use("/otp",otpRoutes);
router.use("/email",verificationEmailRoutes);
router.use("/genericContact", genericContactRoutes);
router.use("/vendorContact", vendorContactRoutes);
router.use("/block", blockUserRoutes);
router.use("/service", serviceRequestRoutes);
router.get("/secret", authRequired, (req, res) => {
  res.send("Secret Found");
});
router.get("/",(req,res)=>{
	res.send('<h1>Helloooo</h1>');

});

module.exports = router;