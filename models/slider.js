const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Slider_newSchema = new Schema({
    image:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    writer:{
        type: String,
        required: true
    },
    slide_status:{
        type: String,
        required: true
    },
    slide_date:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('slider', Slider_newSchema);