const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Gallery_newSchema = new Schema({
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
    writer:{
        type: String,
        required: true
    },
    gallery_status:{
        type: String,
        required: true
    }
},{
    timestamps:true
});

module.exports = mongoose.model('gallery', Gallery_newSchema);