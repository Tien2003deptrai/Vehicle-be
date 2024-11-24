const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    LicenseID: { type: String, required: true, unique: true },
    UserID: { type: String, required: true, unique: true, ref: 'User' },
    Class: {
        type: String,
        required: true,
        enum: ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'C']
    },
    Expire: { type: Date, required: true },
    Image: { type: String, required: true }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
