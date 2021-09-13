const mongoose = require("mongoose");

const genericContactSchema = new mongoose.Schema({
        genericId:{
            type: Number,
            unique: true,
        },
        name:{
            type: String,
            required: [true, "Please enter Name"],
        },
        email:{
            type: String,
            required: [true, "PLease enter email Id"],
        },
        message:{
            type: String,
            required: [true, "PLease enter a message"],
        }
    },
) 

module.exports = mongoose.model("Generic Contact", genericContactSchema);