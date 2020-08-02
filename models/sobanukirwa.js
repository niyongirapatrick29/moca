const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const Sobanukirwa_newSchema = new Schema({

    ikibazo: {
        type: String,
        required: true
    },
    igisubizo: {
        type: String,
        required: false
    },
    ikibazo_status: {
        type: String,
        required: true
    },
    ikibazo_date: {
        type: String,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]

}, {
    timestamps: true
});

module.exports = mongoose.model('sobanukirwa', Sobanukirwa_newSchema);