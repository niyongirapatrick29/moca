const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Anouncement_newSchema = new Schema({
    image:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    product_subtitle:{
        type: String,
        required: true
    },
    writer:{
        type: String,
        required: true
    },
    anounce_status:{
        type: String,
        required: true
    },
    anounce_date:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('anouncement', Anouncement_newSchema);