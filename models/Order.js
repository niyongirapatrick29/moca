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
    order_note: { type: String },
    payment_method: { type: String, required: true },
    status: { type: String, default: "Pending" }
}, {
    timestamps: true
});

module.exports = mongoose.model("orders", OrderSchema);