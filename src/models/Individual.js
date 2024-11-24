const mongoose = require("mongoose");

const individualSchema = new mongoose.Schema({
    idvID: { type: String, required: true, unique: true },
    UserID: { type: String, required: true, unique: true, ref: 'VehicleHireService' }
});

const Individual = mongoose.model('Individual', individualSchema);

module.exports = Individual;
