const mongoose = require("mongoose");

const vehicleHireServiceSchema = new mongoose.Schema({
    UserID: { type: String, required: true, unique: true, ref: 'User' },
    ServiceType: {
        type: String,
        required: true,
        enum: ['INDIVIDUAL', 'BUSINESS']
    },
    Bank_name: { type: String, required: true },
    Bank_account: {
        type: String,
        required: true,
        unique: true,
        validate: { validator: v => v.length >= 8 && v.length <= 15 }
    }
});

const VehicleHireService = mongoose.model('VehicleHireService', vehicleHireServiceSchema);

module.exports = VehicleHireService;
