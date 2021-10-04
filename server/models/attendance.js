const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
        name:{
            type: String,
        },
        userCode:{
            type: String,
            required: true,
        },
        startTime:{
            type: String,
            default: null
        },
        endTime:{
            type: String,
            default: null
        },
        date:{
            type: String,
            default: null
        },
        day:{
            type: String,
            default: null
        },
        latitude:{
            type: String,
            default: null
        },
        longitude:{
            type: String,
            default: null
        },
        attendance_status:{
            type: Number,
            default: 0,
        }
    },
) 

module.exports = mongoose.model("Attendance", attendanceSchema);