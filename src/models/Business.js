const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
    BsnID: { type: String, required: true, unique: true },
    UserID: { type: String, required: true, unique: true, ref: 'VehicleHireService' },
    Description: { type: String, unique: true, required: true },
    Business_img: { type: String, required: true },
    Registration_date: { type: Date, required: true },
    VAT: { type: Number, required: true, min: 0 },
    Issuing_location: { type: String, required: true },
    Date_of_issue: { type: Date, required: true }
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;

