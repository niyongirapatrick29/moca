const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Category = new Schema({
    categoryName: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
}, { timestamps: true });

module.exports = mongoose.model('Category', Category);