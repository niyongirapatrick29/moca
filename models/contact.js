const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contact_newSchema = new Schema({
    
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    contact_status:{
        type: String,
        required: true
    }
    
});

module.exports = mongoose.model('contact', contact_newSchema);