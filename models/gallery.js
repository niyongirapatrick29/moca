const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const Schema = mongoose.Schema;

const Gallery_newSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    product_subtitle: {
        type: String,
        required: true
    },
    writer: {
        type: String,
        required: true
    },
    gallery_status: {
        type: String,
        required: true
    },
    slug: { type: String }
}, {
    timestamps: true
});
Gallery_newSchema.plugin(URLSlugs('title', { field: 'slug' }));
module.exports = mongoose.model('gallery', Gallery_newSchema);