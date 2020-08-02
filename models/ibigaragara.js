const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Ibigaragara_newSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    subtitle:{
        type: String,
        required: true
    },
    full_news:{
        type: String,
        required: true
    },
    image_news:{
        type: String,
        required: true
    },
    writer:{
        type: String,
        required: true
    },
    news_status:{
        type: String,
        required: true
    },
    new_date:{
        type:String,
        required: true
    },
    news_comments:{
        comment: [{
            name:{
                type: String,
                required: true
            },
            email:{
                type: String,
                required:true
            },
            message:{
                type: String,
                required: true
            }
        }]
    }
});

module.exports = mongoose.model('ibigaragara_news', Ibigaragara_newSchema);