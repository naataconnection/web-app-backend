const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    invoiceCode: {
        type: String,
        unique: true
    },
    driver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "driver"
    },
    numberParcels:{
        type: Number
    },
    parcelType:{
        type: String
    },
    dispatched:{
        type: Boolean,
        default: false
    },
    delivered:{
        type: Boolean,
        default: false
    }
})