const mongoose = require("mongoose");

const userStatSchema = new mongoose.Schema({
    userCode:{
        type: String,
        unique: true,
    },
    dateOfJoining: {
        type: String,
        default: null,
    },
    dateOfTermination: {
        type: String,
        default: null,
    },
    currLatitude: {
        type: String,
        default: null
    },
    currLongitude: {
        type: String,
        default: null
    },
    ipAddress: {
        type: String,
    }
});

module.exports = mongoose.model('UserStat', userStatSchema);