const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    invoiceCode: {
        type: String,
        unique: true
    },
    invoiceId: {
        type: String,
        unique: true
    },
    numberParcels:{
        type: Number,
        default: 0
    },
    parcelWeight:{
        type: Number,
        default: 0
    },
    deliveryAddress:{
        type: String,
        required: true
    },
    parcelType:{
        type: String,
        required: true
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