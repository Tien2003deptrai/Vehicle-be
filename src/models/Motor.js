const mongoose = require("mongoose");

const motorSchema = new mongoose.Schema({
    MotorID: { type: String, required: true, unique: true },
    VehicleID: { type: String, required: true, unique: true, ref: 'Vehicle' },
    MotorImage: { type: String, required: true }
});

const Motor = mongoose.model('Motor', motorSchema);

module.exports = Motor;
