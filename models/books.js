const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Books_newSchema = new Schema({
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
    books:{
        type: String,
        required: true
    },
    writer:{
        type: String,
        required: true
    },
    book_status:{
        type: String,
        required: true
    },
    book_comment:{
        comment:[{
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
            }
        }]
    }
});

module.exports = mongoose.model('books', Books_newSchema);