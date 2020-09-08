const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CakeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    product_subtitle: {
        type: String,
        required: true
    },
    cake_description: {
        type: String,
        required: true
    },
    image_news: {
        type: String,
        required: true
    },
    writer: {
        type: String,
        required: true
    },
    product_status: {
        type: String,
        required: true
    },
    new_date: {
        type: String,
        required: true
    },
    news_comments: {
        comment: [{
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            }
        }]
    }
});

module.exports = mongoose.model('cakes', CakeSchema);