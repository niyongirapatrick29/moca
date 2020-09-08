const { mongo } = require("mongoose");

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    fname: { type: String },
    lname: { type: String },
    phone: { type: String },
    email: { type: String },
    // cakes details
    image: { type: String },
    cake_name: { type: String },
    selectedcake: { type: String },
    filling: { type: String },
    includecandles: { type: String },
    includeinscription: { type: String },
    theinscription: { type: String },
    tt_cost: { type: String },
    transactionId: { type: String },
    country: { type: String },
    province: { type: String },
    district: { type: String },
    sector: { type: String },
    cell: { type: String },
    village: { type: String },
    street: { type: String },
    city: { type: String },
    order_note: { type: String },
    payment_method: { type: String, requred: true },
    payment_status: { type: String, default: "Not Paid" },
    order_status: { type: String, default: "Not yet delivered" },
    orderdate: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("orders", OrderSchema);