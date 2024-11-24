const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    AdminID: { type: String, required: true, unique: true, ref: 'User' },
    LastLogin: { type: Date, required: true }
});

const Admin = mongoose.model('Admin', adminSchema);


module.exports = Admin;