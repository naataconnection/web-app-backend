const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id : mongoose.ObjectId,
    userName : {
        type : String,
        required : true,
        unique : true
    },
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String
    },
    password : {
        type : String,
        required : true
    },
    emailId : {
        type : String,
        required : true 
    }
});

module.exports = mongoose.model('user', userSchema, 'users');