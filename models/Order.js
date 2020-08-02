const { mongo } = require("mongoose");

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    fname: { type: String },
    lname: { type: String },
    phone: { type: String },
    email: { type: String },
    country: { type: String },
    province: { type: String },
    district: { type: String },
    sector: { type: String },
    cell: { type: String },
    village: { type: String },
    street: { type: String },
    city: { type: String },
    order_note: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("orders", OrderSchema);