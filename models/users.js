const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fname:{
        type: String,
        required: true
    },
    lname:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    passcode:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    user_status:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('users', UserSchema);