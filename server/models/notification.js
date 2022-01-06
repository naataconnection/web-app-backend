const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
  
    userCode: {
        type: String,
        required: true,
    },
    image: [
        {
            type: String,
        }
    ],
    content: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    expiryDate: {
        type: String,
        required: true,
    },
    entryDate: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("notification", NotificationSchema);
