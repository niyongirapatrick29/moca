const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Akamaro_newSchema = new Schema({
    image:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    subtitle:{
        type: String,
        required: true
    },
    details_data:{
        type: String,
        required: true
    },
    writer:{
        type: String,
        required: true
    },
    akamaro_status:{
        type: String,
        required: true
    },
    akamaro_date:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('akamaro', Akamaro_newSchema);