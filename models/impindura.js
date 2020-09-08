const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const impindura_newSchema = new Schema({
    image:{
        type:String,
        required:true
    },
    umuhanga:{
        type: String,
        required: true
    },
    ijambo:{
        type: String,
        required: true
    },
    writer:{
        type: String,
        required: true
    },
    product_status:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('impindura', impindura_newSchema);