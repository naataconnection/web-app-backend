const mongoose = require("mongoose");

const ownerFleetHuntSchema = new mongoose.Schema({ 
    firstName:{
        type: String, 
        required: true
    },
    middleName:{
        type:String,
    },
    lastName:{
        type:String,
        required:true
    },
    ipAddress:{
        type: String
    },
    fleetHuntApiKey:{
        type: String,
        default: null
    }
})

module.exports = mongoose.model("ownerFleetHunt", ownerFleetHuntSchema);