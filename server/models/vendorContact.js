const mongoose = require("mongoose");

const vendorContactSchema = new mongoose.Schema(
    {
        vendorId:{
            type: Number,
            unique: true,
        },
        companyName:{
            type: String,
            required: [true, "Please enter Company Name"],
        },
        personName:{
            type: String,
            required: [true, "Please enter Person Name"],
        },
        email:{
            type: String,
			required: [true, "Please enter an email id"],
        },
        contactNumber:{
            type: String,
            required: [true, "Please enter Contact Number"],
        },
        message:{
            type: String,
            default: null,
        }
    }
)

module.exports = mongoose.model("VendorContact", vendorContactSchema);