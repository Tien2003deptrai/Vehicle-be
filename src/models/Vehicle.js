const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    VehicleID: { type: String, required: true, unique: true },
    UserID: { type: String, required: true, ref: 'VehicleHireService' },
    Category: {
        type: String,
        required: true,
        enum: ['MOTOR', 'CAR']
    },
    LicensePlate: { type: String, required: true },
    Status: {
        type: String,
        required: true,
        enum: ['AVAILABILITY', 'RENTED']
    },
    PricePerDay: { type: Number, required: true, min: 0 },
    FuelConsumption: { type: Number, required: true, min: 0 },
    Range: { type: Number, required: true, min: 0 },
    EngineCapacity: { type: Number, required: true, min: 0 }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;

