const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    CarID: { type: String, required: true, unique: true },
    VehicleID: { type: String, required: true, unique: true, ref: 'Vehicle' },
    CarBrand: { type: String, required: true },
    Fuel_type: {
        type: String,
        required: true,
        enum: ['ELECTRIC', 'GASOLINE']
    },
    SeatingCapacity: { type: Number, required: true, min: 1 },
    CarImage: { type: String, required: true },
    ChargingTime: { type: Number, min: 0 }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
